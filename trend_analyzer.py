import ee
import pandas as pd
import pymannkendall as mk
import json
import requests
from pathlib import Path
from datetime import date
from io import BytesIO
from zipfile import ZipFile, is_zipfile
from time import sleep

# 1. Connexion à Google Earth Engine
ee.Initialize(project='planetcred-nasa-hackathon2026')

# 2. Zone d'étude : Ebony Forest, Chamarel (Maurice)
point_projet = ee.Geometry.Point([57.3755, -20.4365])
zone_etude = point_projet.buffer(400)

# 3. Extraction Landsat 8 Collection 2 via GEE
collection = (ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
              .filterBounds(zone_etude)
              .filterDate('2015-01-01', date.today().isoformat()))

# Part des pixels valides requise dans la zone d'étude après masquage QA.
# CLOUD_COVER est une valeur calculée sur toute la scène : elle ne décrit pas
# nécessairement les nuages au-dessus de Chamarel.
COUVERTURE_MINIMALE = 0.60

def telecharger_avec_reprise(url, delai_lecture=300, tentatives=4):
    """Télécharge un résultat Earth Engine avec reprise après timeout réseau."""
    derniere_erreur = None
    for tentative in range(tentatives):
        try:
            reponse = requests.get(url, timeout=(20, delai_lecture))
            reponse.raise_for_status()
            return reponse
        except (requests.Timeout, requests.ConnectionError) as erreur:
            derniere_erreur = erreur
            if tentative == tentatives - 1:
                break
            attente = min(10 * (tentative + 1), 30)
            print(f"Téléchargement Earth Engine interrompu; nouvel essai dans {attente}s ({tentative + 1}/{tentatives - 1}).")
            sleep(attente)
    raise RuntimeError(
        f"Earth Engine n'a pas terminé le téléchargement après {tentatives} tentatives. "
        "Réessaie plus tard ou vérifie ta connexion réseau."
    ) from derniere_erreur

def preparer_et_calculer_ndvi(image):
    # A. Masquage QA_PIXEL : remplissage, nuage dilaté, cirrus, nuage,
    # ombre de nuage et neige/glace (bits 0 à 5).
    qa = image.select('QA_PIXEL')
    masque_qa = qa.bitwiseAnd(0b111111).eq(0)

    # Ignorer la saturation des bandes rouge/NIR et l'occultation du relief.
    qa_radsat = image.select('QA_RADSAT')
    bandes_visibles_nir = (1 << 1) | (1 << 2) | (1 << 3) | (1 << 4)
    masque_saturation = qa_radsat.bitwiseAnd(bandes_visibles_nir | (1 << 11)).eq(0)
    masque = masque_qa.And(masque_saturation)

    # Facteurs d'échelle officiels Landsat Collection 2 Level-2.
    optique = (image.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5'])
               .multiply(0.0000275).add(-0.2)
               .updateMask(masque))
    image = image.addBands(optique, overwrite=True)

    # Expression explicite : normalizedDifference masque automatiquement les
    # réflectances négatives, alors qu'elles peuvent exister dans SR calibré.
    rouge = image.select('SR_B4')
    proche_infrarouge = image.select('SR_B5')
    ndvi = (proche_infrarouge.subtract(rouge)
            .divide(proche_infrarouge.add(rouge))
            .rename('NDVI')
            .updateMask(masque))
    return image.addBands(ndvi)

def extraire_serie(image):
    stat = image.select('NDVI').reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=zone_etude,
        scale=30,
        maxPixels=1e9
    )
    surface_valide = ee.Image.pixelArea().updateMask(image.select('NDVI').mask()).reduceRegion(
        reducer=ee.Reducer.sum(),
        geometry=zone_etude,
        scale=30,
        maxPixels=1e9
    ).get('area')
    couverture = ee.Number(surface_valide).divide(zone_etude.area())
    return ee.Feature(None, {
        'date': image.date().format('YYYY-MM-dd'),
        'ndvi': stat.get('NDVI'),
        'valid_fraction': couverture
    })

# Garder les scènes dont au moins 60 % de la zone reste exploitable après QA.
feature_collection = (collection
                      .map(preparer_et_calculer_ndvi)
                      .map(extraire_serie)
                      .filter(ee.Filter.notNull(['ndvi', 'valid_fraction']))
                      .filter(ee.Filter.gte('valid_fraction', COUVERTURE_MINIMALE)))

features = feature_collection.getInfo()['features']

# 4. Nettoyage sécurisé avec .get('ndvi') et calcul statistique Mann-Kendall
donnees = [
    {'date': f['properties']['date'], 'ndvi': round(f['properties'].get('ndvi'), 3)}
    for f in features
    if f['properties'].get('ndvi') is not None and -1.0 <= f['properties'].get('ndvi') <= 1.0
]

if len(donnees) < 4:
    raise ValueError(f"Données insuffisantes après masquage des nuages ({len(donnees)} points trouvés).")

df = pd.DataFrame(donnees).sort_values('date').drop_duplicates(subset=['date'])
resultat_mk = mk.original_test(df['ndvi'])

# 5. Composites Landsat 8 visuels, faits avec les pixels clairs sur une année.
# Ils conservent la résolution native de 30 m et évitent le fond VIIRS à 250 m.
collection_claire = collection.map(preparer_et_calculer_ndvi)
debut_avant, fin_avant = '2015-01-01', '2016-01-01'
debut_apres, fin_apres = '2025-01-01', date.today().isoformat()

def enregistrer_composite(debut, fin, nom_fichier):
    composite = (collection_claire.filterDate(debut, fin)
                 .median()
                 .clip(zone_etude))
    rgb = composite.visualize(
        bands=['SR_B4', 'SR_B3', 'SR_B2'],
        min=0.02,
        max=0.30,
        gamma=1.15
    )
    url = rgb.getThumbURL({
        'region': zone_etude,
        'dimensions': 1024,
        'format': 'png',
        'crs': 'EPSG:4326'
    })
    response = telecharger_avec_reprise(url, delai_lecture=300)
    fichier = Path(__file__).resolve().parent / 'assets' / nom_fichier
    fichier.parent.mkdir(parents=True, exist_ok=True)
    fichier.write_bytes(response.content)
    return f'assets/{nom_fichier}'

landsat_avant = enregistrer_composite(debut_avant, fin_avant, 'landsat_before.png')
landsat_apres = enregistrer_composite(debut_apres, fin_apres, 'landsat_after.png')
coords = zone_etude.bounds().coordinates().getInfo()[0]
bornes_carte = [
    [min(point[1] for point in coords), min(point[0] for point in coords)],
    [max(point[1] for point in coords), max(point[0] for point in coords)]
]

# 6. Imagerie visuelle plus détaillée Sentinel-2 L2A à résolution native de 10 m.
# Les fenêtres avant/après sont alignées sur la saison sèche mauricienne.
S2_SEUIL_NUAGE = 35
S2_COUVERTURE_SCENE_MAX = 80
zone_masque_s2 = zone_etude.buffer(100)
s2_sr = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
         .filterBounds(zone_etude)
         .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', S2_COUVERTURE_SCENE_MAX)))
s2_clouds = (ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
             .filterBounds(zone_etude))

def masquer_nuages_s2(image):
    image = image.clip(zone_masque_s2)
    probabilite = ee.Image(image.get('cloud_mask')).select('probability').clip(zone_masque_s2)
    nuage_dilate = probabilite.gte(S2_SEUIL_NUAGE).focalMax(
        radius=60, units='meters')
    scl = image.select('SCL')
    classes_a_rejeter = (scl.neq(0).And(scl.neq(1)).And(scl.neq(3))
                         .And(scl.neq(8)).And(scl.neq(9))
                         .And(scl.neq(10)).And(scl.neq(11)))
    bord_image_valide = image.select('B8A').mask().And(image.select('B9').mask())
    masque_clair = nuage_dilate.Not().And(classes_a_rejeter).And(bord_image_valide)
    return image.updateMask(masque_clair)

def creer_composite_s2(debut, fin, suffixe):
    criteres = ee.Filter.And(
        ee.Filter.bounds(zone_etude), ee.Filter.date(debut, fin))
    sr_periode = s2_sr.filter(criteres).map(
        lambda image: image.updateMask(
            image.select('B8A').mask().And(image.select('B9').mask()))
            .clip(zone_masque_s2))
    nuages_periode = s2_clouds.filter(criteres)
    jointure = ee.Join.saveFirst('cloud_mask').apply(
        primary=sr_periode,
        secondary=nuages_periode,
        condition=ee.Filter.equals(
            leftField='system:index', rightField='system:index'))
    claires = ee.ImageCollection(jointure).filter(
        ee.Filter.notNull(['cloud_mask'])).map(masquer_nuages_s2)
    if claires.size().getInfo() == 0:
        raise ValueError(f'Aucune image Sentinel-2 exploitable entre {debut} et {fin}.')

    composite = claires.select(['B4', 'B3', 'B2']).median().clip(zone_etude)
    apercu = composite.visualize(
        bands=['B4', 'B3', 'B2'], min=0, max=3000, gamma=1.15)
    thumb_url = apercu.getThumbURL({
        'region': zone_etude,
        'dimensions': 256,
        'format': 'png',
        'crs': 'EPSG:32740'
    })
    dossier_assets = Path(__file__).resolve().parent / 'assets'
    dossier_assets.mkdir(parents=True, exist_ok=True)
    nom_png = f'sentinel2_{suffixe}.png'
    print(f"Génération de l'aperçu Sentinel-2 ({suffixe})…")
    reponse_png = telecharger_avec_reprise(thumb_url, delai_lecture=300)
    (dossier_assets / nom_png).write_bytes(reponse_png.content)

    download_url = composite.getDownloadURL({
        'name': f'ebony_forest_sentinel2_{suffixe}',
        'bands': ['B4', 'B3', 'B2'],
        'region': zone_etude,
        'scale': 10,
        'crs': 'EPSG:32740',
        'format': 'GEO_TIFF'
    })
    print(f"Téléchargement du GeoTIFF Sentinel-2 ({suffixe}, 10 m)…")
    reponse_tif = telecharger_avec_reprise(download_url, delai_lecture=300)
    contenu = BytesIO(reponse_tif.content)
    nom_tif = f'sentinel2_{suffixe}.tif'
    if is_zipfile(contenu):
        contenu.seek(0)
        with ZipFile(contenu) as archive:
            tif_member = next((name for name in archive.namelist()
                               if name.lower().endswith('.tif')),
                              None)
            if tif_member is None:
                raise ValueError('Earth Engine download ne contient pas de GeoTIFF.')
            (dossier_assets / nom_tif).write_bytes(archive.read(tif_member))
    else:
        (dossier_assets / nom_tif).write_bytes(reponse_tif.content)
    return {
        'preview': f'assets/{nom_png}',
        'geotiff': f'assets/{nom_tif}',
        'period': [debut, fin]
    }

annee_courante = date.today().year
sentinel_avant = creer_composite_s2('2017-04-01', '2017-11-01', 'before')
sentinel_apres = creer_composite_s2(
    f'{annee_courante}-04-01', f'{annee_courante}-11-01', 'after')

# 7. Sélection des dates disponibles pour les couches de contexte NASA GIBS
date_debut_sans_nuage = df['date'].iloc[0]
date_fin_sans_nuage = df['date'].iloc[-1]

# 8. Construction des endpoints WMTS officiels NASA GIBS
def generer_url_gibs(layer_name, date_str, format_img="jpg", matrix_level="GoogleMapsCompatible_Level9"):
    return (f"https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{layer_name}"
            f"/default/{date_str}/{matrix_level}/{{z}}/{{y}}/{{x}}.{format_img}")

gibs_layers = {
    "true_color_avant": generer_url_gibs("VIIRS_SNPP_CorrectedReflectance_TrueColor", date_debut_sans_nuage, "jpg", "GoogleMapsCompatible_Level9"),
    "true_color_apres": generer_url_gibs("VIIRS_SNPP_CorrectedReflectance_TrueColor", date_fin_sans_nuage, "jpg", "GoogleMapsCompatible_Level9"),
    "ndvi_layer_apres": generer_url_gibs("MODIS_Terra_NDVI_8Day", date_fin_sans_nuage, "png", "GoogleMapsCompatible_Level9")
}

# 9. Validation technique côté Back-End (Vérifier directement le serveur NASA GIBS)
test_url = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetCapabilities"
try:
    gibs_status = "Online" if requests.get(test_url, timeout=5).status_code == 200 else "Offline"
except requests.RequestException:
    gibs_status = "Offline"

# 10. Exportation finale pour le Front-End JavaScript
output_data = {
    "status_gibs": gibs_status,
    "source_calcul": "NASA Landsat 8 Collection 2 Level-2 (Calibration SR + Masque QA_PIXEL via GEE)",
    "source_visuelle": "NASA Earthdata GIBS WMTS",
    "date_avant": date_debut_sans_nuage,
    "date_apres": date_fin_sans_nuage,
    "landsat_rgb": {
        "before": landsat_avant,
        "after": landsat_apres,
        "bounds": bornes_carte,
        "pixel_size_m": 30,
        "before_period": [debut_avant, fin_avant],
        "after_period": [debut_apres, fin_apres]
    },
    "sentinel2_visual": {
        "before": sentinel_avant,
        "after": sentinel_apres,
        "bounds": bornes_carte,
        "pixel_size_m": 10,
        "bands": ["B4", "B3", "B2"],
        "cloud_probability_max": S2_SEUIL_NUAGE,
        "source": "Copernicus Sentinel-2 SR Harmonized"
    },
    "gibs_urls": gibs_layers,
    "statistiques": {
        "trend_direction": resultat_mk.trend,
        "p_value": round(resultat_mk.p, 5),
        "significatif": bool(resultat_mk.p < 0.05),
        "nombre_observations": len(df)
    },
    "serie_temporelle": {
        "dates": df['date'].tolist(),
        "valeurs": df['ndvi'].tolist()
    }
}

# Création automatique du dossier 'data' dans le répertoire du script
base_dir = Path(__file__).resolve().parent
data_dir = base_dir / 'data'
data_dir.mkdir(parents=True, exist_ok=True)
output_file = data_dir / 'project_analysis.json'

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=4, ensure_ascii=False)

print(f"Analyse GEE calibrée exportée avec succès ({len(df)} observations valides) dans : {output_file}")
