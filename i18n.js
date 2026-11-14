(function () {
  const languages = {
    en: { name: "English", flag: "assets/flags/gb.svg" },
    fr: { name: "Français", flag: "assets/flags/fr.svg" },
    mg: { name: "Malagasy", flag: "assets/flags/mg.svg" },
    ig: { name: "Igbo (Nigeria)", flag: "assets/flags/ng.svg" },
  };

  const translations = {
    en: {
      "brand.tagline": "Earth Observation Intelligence", "nav.systemReady": "● System Ready", "nav.menu": "Menu", "nav.open": "Open navigation menu", "nav.close": "Close navigation menu", "nav.title": "Navigation", "nav.dashboard": "Dashboard", "nav.projects": "Projects", "nav.methodology": "Methodology", "nav.about": "About PlanetCred", "nav.footer": "Earth observation intelligence for verified climate action.", "nav.language": "Language",
      "common.back": "← Dashboard", "common.openDashboard": "Open project dashboard", "common.explore": "Explore our website →", "common.loading": "Loading projects…", "common.unavailable": "Project data unavailable",
      "project.select": "Select registered project", "project.title": "Ebony Forest Endemic Restoration", "project.pendingOption": "Second project (pending data)", "project.pendingTitle": "Project data pending", "project.pendingStatus": "Pending data", "project.pendingDescription": "Project information has not been provided yet.", "project.publicSources": "Public sources only", "project.organization": "Organisation:", "project.coordinates": "Coordinates:", "project.startDate": "Start date:", "project.description": "Ebony Forest restores Mauritius' endemic forest in Chamarel by controlling invasive plants, propagating native species, and planting endemic plants. Public photos are illustrative, not community audit evidence.", "project.analysisExtent": "Satellite analysis extent (400 m radius; bounding envelope)",
      "proof.title": "Community evidence", "proof.empty": "No community evidence has been uploaded.", "proof.source": "SOURCE", "proof.inspect": "Inspect", "proof.planting": "Planting at Ebony Forest", "proof.saplings": "Sapling restoration", "proof.method": "Restoration method", "proof.forest": "Forest restoration in Mauritius", "proof.fieldPhoto": "Illustrative field photo", "proof.forestPhoto": "Illustrative forest restoration photo", "proof.organizationSource": "Organisation source", "proof.projectPhoto": "Illustrative project photo", "proof.plantingNote": "Photo published by Norwich Research Park; the source describes planting at Ebony Forest. This is not a project audit record.", "proof.saplingNote": "Image shown on a third-party Ebony Forest guide; illustrative only, not a dated audit record.", "proof.methodNote": "Mauritius Chamarel restoration technique image from a presentation; illustrative only, not an Ebony Forest audit badge.", "proof.forestNote": "Photo published by Norwich Research Park; illustrative, not a project audit record.", "proof.auditLog": "Source record",
      "metric.variable": "Observed variable", "metric.ndvi": "NDVI (vegetation)", "metric.datasetPlaceholder": "Dataset: waiting for analysis", "metric.datasetLandsat": "NASA Landsat 8 Collection 2 Level-2 (surface reflectance)", "metric.trend": "Trend direction", "metric.period": "Period:", "metric.firstLast": "First-to-last NDVI change:", "metric.significance": "Statistical significance", "metric.pValue": "Mann–Kendall p-value:", "metric.significant": "Significant (p < 0.05)", "metric.notSignificant": "Not significant", "trend.increasing": "INCREASING", "trend.decreasing": "DECREASING", "trend.noTrend": "NO TREND",
      "map.title": "Spatial context & satellite comparison", "map.region": "Interactive project map", "map.periodPending": "Image comparison periods load from the analysis data.", "map.windows": "Composite windows: {before} | {after}", "map.windowTitle": "Composite window: {range}", "map.beforeDefault": "Before layer", "map.afterDefault": "After layer", "map.before": "Before layer ({year})", "map.after": "After layer ({year})", "map.projectPopup": "Ebony Forest analysis area",
      "chart.title": "Landsat 8 NDVI observations and fitted trend ({first}–{last})", "chart.initialTitle": "Landsat 8 NDVI observations and trend", "chart.aria": "Landsat 8 NDVI values over time", "chart.observed": "Landsat 8 NDVI observations (n={count})", "chart.fitted": "Linear trend from observed data", "chart.note": "NDVI is a vegetation greenness indicator. An upward trend alone does not prove that the project caused the change.", "metric.deltaFormat": "{delta} NDVI ({percent}%)",
      "imagery.title": "Detailed imagery · Sentinel‑2", "imagery.subtitle": "10 m native-resolution RGB composite. Download the GeoTIFFs for inspection outside the map.", "imagery.pixel": "10 m / pixel", "imagery.reference": "Reference", "imagery.recent": "Recent", "imagery.alt": "Sentinel-2 {period} composite preview at 10 m source resolution", "imagery.download": "GeoTIFF", "imagery.note": "GeoTIFFs contain the red, green, and blue reflectance bands in UTM 40S. A 10 m pixel cannot show individual trees; metre-scale imagery requires authorized aerial or commercial data.",
      "milestone.title": "Project milestone validation log", "milestone.eo": "EO verified", "milestone.ground": "Ground verified", "milestone.empty": "No milestone records are available.", "milestone.sitePrep": "Activity milestone 1 (site preparation)", "milestone.planting": "Activity milestone 2 (initial planting)", "milestone.monitoring": "Activity milestone 3 (maintenance and monitoring)",
      "method.title": "Data cleaning", "method.kicker": "Satellite methodology", "method.intro": "A clear sky is not found by filtering only scenes with a low overall cloud percentage. The pipeline masks invalid pixels, measures clear coverage over Chamarel, then combines valid pixels from multiple acquisitions.", "method.qaTitle": "1. Landsat quality mask", "method.qaBody": "In QA_PIXEL, remove bits 0–5: fill, dilated cloud, cirrus, cloud, cloud shadow, and snow/ice. In QA_RADSAT, remove saturated red/NIR pixels and terrain-occluded pixels.", "method.coverageTitle": "2. Local clear coverage", "method.coverageBody": "Measure the share of valid surface remaining in the project area after masking. The script keeps an observation only when at least 60% of the area is usable. This local check is more useful than CLOUD_COVER, which summarizes the entire scene.", "method.compositeTitle": "3. Before / after composites", "method.compositeBody": "For display, the script takes the median of clear pixels over annual periods (2015 and 2025 to the present). Persistent clouds remain masked instead of being replaced with invented values. The generated files are landsat_before.png and landsat_after.png.", "method.resolutionTitle": "4. Resolution: what zoom can do", "method.resolutionBody": "The current VIIRS GIBS layer is 250 m per pixel. For the project area, the script now creates a 10 m Sentinel‑2 composite and a downloadable RGB GeoTIFF. This shows plots and forest cover more clearly, but not individual trees. Metre-scale Google Earth imagery requires authorized aerial or commercial data.", "method.constraintsTitle": "Other constraints to check", "method.constraintsBody": "Thin clouds, haze, terrain shadows, saturated pixels, water, small sample sizes, and seasonality can bias NDVI. Compare the same season, measure clear-pixel coverage for each observation, record selected dates, and do not interpolate large gaps. Sentinel‑2 is used here for 10 m visual imagery; the NDVI trend remains based on Landsat 8 at 30 m, and the two series are not mixed.", "method.run": "To generate PNG previews and before/after GeoTIFFs, run python trend_analyzer.py with Earth Engine authenticated. Files are written to assets/ and download links appear on the dashboard. Use the GeoTIFFs in QGIS or image software; the web preview is for quick viewing.",
      "about.kicker": "About the project", "about.title": "PlanetCred Earth Observation Intelligence", "about.body": "PlanetCred DI connects community-reported climate action with satellite observations, making project evidence and environmental trends easier to explore in one place.", "about.event": "Built for NASA Space Apps 2026 · Port Louis", "projects.title": "Registered projects", "projects.body": "Explore community-led climate actions and their Earth observation evidence in the dashboard.", "projects.wasteManagement": "Waste Management",
    },
    fr: {
      "brand.tagline": "Intelligence d’observation de la Terre", "nav.systemReady": "● Système prêt", "nav.menu": "Menu", "nav.open": "Ouvrir le menu de navigation", "nav.close": "Fermer le menu de navigation", "nav.title": "Navigation", "nav.dashboard": "Tableau de bord", "nav.projects": "Projets", "nav.methodology": "Méthodologie", "nav.about": "À propos de PlanetCred", "nav.footer": "L’observation de la Terre au service d’actions climatiques vérifiées.", "nav.language": "Langue",
      "common.back": "← Tableau de bord", "common.openDashboard": "Ouvrir le tableau de bord des projets", "common.explore": "Visiter notre site →", "common.loading": "Chargement des projets…", "common.unavailable": "Données de projet indisponibles",
      "project.select": "Sélectionner un projet enregistré", "project.title": "Restauration endémique d’Ebony Forest", "project.pendingOption": "Deuxième projet (données en attente)", "project.pendingTitle": "Données du projet en attente", "project.pendingStatus": "Données en attente", "project.pendingDescription": "Les informations du projet n’ont pas encore été fournies.", "project.publicSources": "Sources publiques uniquement", "project.organization": "Organisation :", "project.coordinates": "Coordonnées :", "project.startDate": "Date de début :", "project.description": "Ebony Forest restaure la forêt endémique de Maurice à Chamarel en contrôlant les plantes envahissantes, en multipliant les espèces indigènes et en plantant des espèces endémiques. Les photos publiques sont illustratives, pas des preuves d’audit communautaire.", "project.analysisExtent": "Emprise de l’analyse satellite (rayon de 400 m ; enveloppe)",
      "proof.title": "Preuves communautaires", "proof.empty": "Aucune preuve communautaire n’a été ajoutée.", "proof.source": "SOURCE", "proof.inspect": "Examiner", "proof.planting": "Plantation à Ebony Forest", "proof.saplings": "Restauration par jeunes plants", "proof.method": "Méthode de restauration", "proof.forest": "Restauration forestière à Maurice", "proof.fieldPhoto": "Photo de terrain illustrative", "proof.forestPhoto": "Photo illustrative de restauration forestière", "proof.organizationSource": "Source de l’organisation", "proof.projectPhoto": "Photo de projet illustrative", "proof.plantingNote": "Photo publiée par Norwich Research Park; la source décrit une plantation à Ebony Forest. Ce n’est pas un dossier d’audit du projet.", "proof.saplingNote": "Image présentée dans un guide tiers d’Ebony Forest; illustrative et sans date d’audit.", "proof.methodNote": "Image d’une technique de restauration à Chamarel tirée d’une présentation; illustrative, ce n’est pas un badge d’audit d’Ebony Forest.", "proof.forestNote": "Photo publiée par Norwich Research Park; illustrative, ce n’est pas un dossier d’audit du projet.", "proof.auditLog": "Fiche de source",
      "metric.variable": "Variable observée", "metric.ndvi": "NDVI (végétation)", "metric.datasetPlaceholder": "Jeu de données : analyse en attente", "metric.datasetLandsat": "NASA Landsat 8 Collection 2 Level-2 (réflectance de surface)", "metric.trend": "Direction de la tendance", "metric.period": "Période :", "metric.firstLast": "Variation du NDVI entre début et fin :", "metric.significance": "Significativité statistique", "metric.pValue": "Valeur p de Mann–Kendall :", "metric.significant": "Significatif (p < 0,05)", "metric.notSignificant": "Non significatif", "trend.increasing": "EN HAUSSE", "trend.decreasing": "EN BAISSE", "trend.noTrend": "PAS DE TENDANCE",
      "map.title": "Contexte spatial et comparaison satellite", "map.region": "Carte interactive du projet", "map.periodPending": "Les périodes de comparaison seront chargées depuis les données d’analyse.", "map.windows": "Périodes composites : {before} | {after}", "map.windowTitle": "Période composite : {range}", "map.beforeDefault": "Couche avant", "map.afterDefault": "Couche après", "map.before": "Couche avant ({year})", "map.after": "Couche après ({year})", "map.projectPopup": "Zone d’analyse d’Ebony Forest",
      "chart.title": "Observations NDVI Landsat 8 et tendance ajustée ({first}–{last})", "chart.initialTitle": "Observations NDVI Landsat 8 et tendance", "chart.aria": "Valeurs NDVI Landsat 8 au fil du temps", "chart.observed": "Observations NDVI Landsat 8 (n={count})", "chart.fitted": "Tendance linéaire calculée sur les observations", "chart.note": "Le NDVI indique la verdure de la végétation. Une tendance à la hausse ne prouve pas à elle seule que le projet a causé ce changement.", "metric.deltaFormat": "{delta} NDVI ({percent} %)",
      "imagery.title": "Imagerie détaillée · Sentinel‑2", "imagery.subtitle": "Composite RVB à résolution native de 10 m. Téléchargez les GeoTIFF pour les examiner hors de la carte.", "imagery.pixel": "10 m / pixel", "imagery.reference": "Référence", "imagery.recent": "Récent", "imagery.alt": "Aperçu du composite Sentinel‑2 {period} à 10 m de résolution source", "imagery.download": "GeoTIFF", "imagery.note": "Les GeoTIFF contiennent les bandes de réflectance rouge, verte et bleue en UTM 40S. Un pixel de 10 m ne montre pas les arbres individuellement; une imagerie autorisée aérienne ou commerciale est nécessaire pour atteindre le mètre.",
      "milestone.title": "Journal de validation des étapes du projet", "milestone.eo": "Vérifié par observation de la Terre", "milestone.ground": "Vérifié sur le terrain", "milestone.empty": "Aucun jalon n’est disponible.", "milestone.sitePrep": "Jalon 1 (préparation du site)", "milestone.planting": "Jalon 2 (plantation initiale)", "milestone.monitoring": "Jalon 3 (entretien et suivi)",
      "method.title": "Nettoyage des données", "method.kicker": "Méthodologie satellite", "method.intro": "Un ciel dégagé ne se repère pas en filtrant seulement les scènes dont le pourcentage global de nuages est faible. Le pipeline masque les pixels invalides, mesure la couverture claire à Chamarel, puis combine les pixels valides de plusieurs acquisitions.", "method.qaTitle": "1. Masque qualité Landsat", "method.qaBody": "Dans QA_PIXEL, retirer les bits 0–5 : remplissage, nuage dilaté, cirrus, nuage, ombre de nuage et neige/glace. Dans QA_RADSAT, retirer les pixels saturés des bandes rouge/NIR et ceux masqués par le relief.", "method.coverageTitle": "2. Couverture claire locale", "method.coverageBody": "Mesurer la part de surface valide restante dans la zone du projet après masquage. Le script ne garde une observation que si au moins 60 % de la zone est exploitable. Ce contrôle local est plus utile que CLOUD_COVER, qui résume toute la scène.", "method.compositeTitle": "3. Composites avant / après", "method.compositeBody": "Pour l’affichage, le script calcule la médiane des pixels dégagés sur des périodes annuelles (2015 et 2025 à aujourd’hui). Les nuages persistants restent masqués au lieu d’être remplacés par des valeurs inventées. Les fichiers générés sont landsat_before.png et landsat_after.png.", "method.resolutionTitle": "4. Résolution : limites du zoom", "method.resolutionBody": "La couche VIIRS de GIBS est à 250 m par pixel. Pour la zone du projet, le script crée un composite Sentinel‑2 à 10 m et un GeoTIFF RVB téléchargeable. Les parcelles et la couverture forestière sont plus visibles, mais pas les arbres individuellement. Une image Google Earth métrique nécessite une source aérienne ou commerciale autorisée.", "method.constraintsTitle": "Autres contraintes à vérifier", "method.constraintsBody": "Les nuages fins, la brume, les ombres du relief, les pixels saturés, l’eau, les petits échantillons et la saisonnalité peuvent biaiser le NDVI. Comparer la même saison, mesurer la couverture claire pour chaque observation, noter les dates retenues et ne pas interpoler les grandes lacunes. Sentinel‑2 sert ici à l’imagerie visuelle à 10 m; la tendance NDVI reste calculée avec Landsat 8 à 30 m, sans mélanger les séries.", "method.run": "Pour produire les aperçus PNG et les GeoTIFF avant/après, lancez python trend_analyzer.py avec Earth Engine authentifié. Les fichiers sont écrits dans assets/ et les liens de téléchargement apparaissent dans le tableau de bord. Utilisez les GeoTIFF dans QGIS ou un logiciel d’imagerie; l’aperçu Web sert à une consultation rapide.",
      "about.kicker": "À propos du projet", "about.title": "PlanetCred — Intelligence d’observation de la Terre", "about.body": "PlanetCred DI relie les actions climatiques signalées par les communautés aux observations satellites, pour explorer au même endroit les preuves des projets et les tendances environnementales.", "about.event": "Créé pour NASA Space Apps 2026 · Port-Louis", "projects.title": "Projets enregistrés", "projects.body": "Explorez les actions climatiques menées par les communautés et leurs preuves d’observation de la Terre dans le tableau de bord.", "projects.wasteManagement": "Gestion des déchets",
    },
    mg: {
      "brand.tagline": "Faharanitan-tsaina momba ny fandinihana ny Tany", "nav.systemReady": "● Vonona ny rafitra", "nav.menu": "Menu", "nav.open": "Sokafy ny menio fitetezana", "nav.close": "Hidio ny menio fitetezana", "nav.title": "Fitetezana", "nav.dashboard": "Tabilao fanaraha-maso", "nav.projects": "Tetikasa", "nav.methodology": "Fomba fiasa", "nav.about": "Momba ny PlanetCred", "nav.footer": "Fandinihana ny Tany ho an’ny hetsika momba ny toetrandro voamarina.", "nav.language": "Fiteny",
      "common.back": "← Tabilao fanaraha-maso", "common.openDashboard": "Sokafy ny tabilao misy ny tetikasa", "common.explore": "Tsidiho ny tranokalanay →", "common.loading": "Mameno ny tetikasa…", "common.unavailable": "Tsy misy ny angon-drakitra momba ny tetikasa",
      "project.select": "Misafidiana tetikasa voasoratra", "project.title": "Famerenana ny ala zanatany ao Ebony Forest", "project.pendingOption": "Tetikasa faharoa (miandry angona)", "project.pendingTitle": "Miandry ny angon-drakitra momba ny tetikasa", "project.pendingStatus": "Miandry angona", "project.pendingDescription": "Mbola tsy nomena ny mombamomba ny tetikasa.", "project.publicSources": "Loharano ampahibemaso ihany", "project.organization": "Fikambanana:", "project.coordinates": "Toerana:", "project.startDate": "Daty nanombohana:", "project.description": "Mamerina ny ala zanatany ao Chamarel, Maorisy, ny Ebony Forest amin’ny alalan’ny fifehezana ny zavamaniry vahiny manafika, fampitomboana ireo karazana zanatany ary fambolena azy. Sary fanazavana ny sary ampahibemaso fa tsy porofo fanamarinana avy amin’ny vondrom-piarahamonina.", "project.analysisExtent": "Faritra nodinihina tamin’ny zanabolana (radius 400 m; sisiny ivelany)",
      "proof.title": "Porofo avy amin’ny vondrom-piarahamonina", "proof.empty": "Tsy mbola nampidirina ny porofo avy amin’ny vondrom-piarahamonina.", "proof.source": "LOHARANO", "proof.inspect": "Jereo", "proof.planting": "Fambolena hazo ao Ebony Forest", "proof.saplings": "Famerenana ala amin’ny zana-kazo", "proof.method": "Fomba famerenana ala", "proof.forest": "Famerenana ala eto Maorisy", "proof.fieldPhoto": "Sary eny an-toerana fanazavana", "proof.forestPhoto": "Sary fanazavana momba ny famerenana ala", "proof.organizationSource": "Loharanon’ny fikambanana", "proof.projectPhoto": "Sary fanazavana momba ny tetikasa", "proof.plantingNote": "Sary navoakan’ny Norwich Research Park; milaza ny loharano fa fambolena tao Ebony Forest izany. Tsy rakitra fanamarinana ny tetikasa ity.", "proof.saplingNote": "Sary hita amin’ny torolalana Ebony Forest an’ny antoko fahatelo; fanazavana fotsiny fa tsy rakitra fanamarinana misy daty.", "proof.methodNote": "Sary momba ny fomba famerenana ala tao Chamarel avy amin’ny famelabelarana; fanazavana fotsiny fa tsy mari-pankasitrahana avy amin’ny Ebony Forest.", "proof.forestNote": "Sary navoakan’ny Norwich Research Park; fanazavana fotsiny fa tsy rakitra fanamarinana ny tetikasa.", "proof.auditLog": "Rakitra loharano",
      "metric.variable": "Mari-pandrefesana nodinihina", "metric.ndvi": "NDVI (zavamaniry)", "metric.datasetPlaceholder": "Angon-drakitra: miandry fanadihadiana", "metric.datasetLandsat": "NASA Landsat 8 Collection 2 Level-2 (taratry ny velaran-tany)", "metric.trend": "Lalan’ny fironana", "metric.period": "Fe-potoana:", "metric.firstLast": "Fiovan’ny NDVI hatrany am-piandohana ka hatramin’ny farany:", "metric.significance": "Manan-danja ara-statistika", "metric.pValue": "Sanda p Mann–Kendall:", "metric.significant": "Manan-danja (p < 0,05)", "metric.notSignificant": "Tsy manan-danja", "trend.increasing": "MITOMBO", "trend.decreasing": "MIHENA", "trend.noTrend": "TSY MISY FIRONA",
      "map.title": "Toe-javatra ara-jeografia sy fampitahana zanabolana", "map.region": "Sarintanin’ny tetikasa azo ifandraisana", "map.periodPending": "Hampidirina avy amin’ny angon-drakitra ny fe-potoana fampitahana.", "map.windows": "Fe-potoana nanaovana sary mitambatra: {before} | {after}", "map.windowTitle": "Fe-potoana nanaovana sary mitambatra: {range}", "map.beforeDefault": "Sary teo aloha", "map.afterDefault": "Sary tatỳ aoriana", "map.before": "Sary teo aloha ({year})", "map.after": "Sary tatỳ aoriana ({year})", "map.projectPopup": "Faritra nodinihina tao Ebony Forest",
      "chart.title": "Fandrefesana NDVI Landsat 8 sy fironana voakajy ({first}–{last})", "chart.initialTitle": "Fandrefesana NDVI Landsat 8 sy fironana", "chart.aria": "Sanda NDVI Landsat 8 araka ny fotoana", "chart.observed": "Fandrefesana NDVI Landsat 8 (n={count})", "chart.fitted": "Fironana tsipika avy amin’ny angona nodinihina", "chart.note": "Mari-pandrefesana ny hamaitsoan’ny zavamaniry ny NDVI. Tsy manaporofo irery ny anton’ny fiovana ny fironana miakatra.", "metric.deltaFormat": "{delta} NDVI ({percent}%)",
      "imagery.title": "Sary amin’ny antsipiriany · Sentinel‑2", "imagery.subtitle": "Sary mitambatra RGB amin’ny antsipiriany 10 m. Sintomy ny GeoTIFF hijerena azy ivelan’ny sarintany.", "imagery.pixel": "10 m / pixel", "imagery.reference": "Tondro fampitahana", "imagery.recent": "Vaovao", "imagery.alt": "Sary santionany Sentinel‑2 {period} amin’ny antsipiriany 10 m", "imagery.download": "GeoTIFF", "imagery.note": "Ahitana taratra mena, maitso ary manga ao amin’ny UTM 40S ny GeoTIFF. Tsy ahitana hazo tsirairay ny pixel 10 m; ilaina ny sary an’habakabaka na ara-barotra nahazoana alalana raha mila antsipiriany amin’ny metatra.",
      "milestone.title": "Bokim-panamarinana ny dingan’ny tetikasa", "milestone.eo": "Voamarina tamin’ny zanabolana", "milestone.ground": "Voamarina teny an-toerana", "milestone.empty": "Tsy misy dingana voarakitra.", "milestone.sitePrep": "Dingana 1 (fanomanana ny toerana)", "milestone.planting": "Dingana 2 (fambolena voalohany)", "milestone.monitoring": "Dingana 3 (fikojakojana sy fanaraha-maso)",
      "method.title": "Fanadiovana ny angon-drakitra", "method.kicker": "Fomba fiasa amin’ny zanabolana", "method.intro": "Tsy ampy ny mifidy sary manana rahona kely manerana ny sehatra. Esorin’ny dingana ny pixel tsy manan-kery, refesiny ny faritra mazava ao Chamarel, ary atambany ny pixel azo ampiasaina avy amin’ny fakana sary maromaro.", "method.qaTitle": "1. Sivana kalitao Landsat", "method.qaBody": "Ao amin’ny QA_PIXEL, esory ny bits 0–5: famenoana, rahona nitarina, cirrus, rahona, aloky ny rahona ary lanezy/ranomandry. Ao amin’ny QA_RADSAT, esory ny pixel mena/NIR tototry ny taratra sy ireo voasakan’ny relief.", "method.coverageTitle": "2. Faritra mazava eo an-toerana", "method.coverageBody": "Refeso ny ampahan’ny velaran’ny tetikasa mbola azo ampiasaina aorian’ny sivana. Tazonin’ny script ny fandrefesana raha 60% farafahakeliny no mazava. Mahasoa kokoa noho ny CLOUD_COVER manome salan’isa ho an’ny sary manontolo izany.", "method.compositeTitle": "3. Sary mitambatra taloha / vaovao", "method.compositeBody": "Ho an’ny fampisehoana, kajian’ny script ny medianan’ny pixel mazava mandritra ny taona (2015 sy 2025 hatramin’izao). Avela ho voasivana ny rahona maharitra fa tsy soloina sanda noforonina. landsat_before.png sy landsat_after.png no rakitra vokarina.", "method.resolutionTitle": "4. Antsipirian’ny sary sy ny zoom", "method.resolutionBody": "250 m isaky ny pixel ny sosona VIIRS GIBS ankehitriny. Mamorona sary Sentinel‑2 10 m sy GeoTIFF RGB azo sintomina ho an’ny faritra ny script. Hita mazava kokoa ny saha sy ny rakotra ala, fa tsy ny hazo tsirairay. Mila sary an’habakabaka na ara-barotra nahazoana alalana ny antsipiriany manakaiky ny metatra.", "method.constraintsTitle": "Sakana hafa tokony hojerena", "method.constraintsBody": "Mety hanova ny NDVI ny rahona manify, zavona, aloky ny relief, pixel tototry, rano, santionany vitsy ary fiovaovan’ny vanim-potoana. Ampitahao ny vanim-potoana mitovy, refeso ny pixel mazava isaky ny fandrefesana, raketo ny daty ary aza mameno elanelana lehibe amin’ny vinavina. Sentinel‑2 no ampiasaina amin’ny sary 10 m; Landsat 8 30 m ihany no ampiasaina amin’ny fironana NDVI, ary tsy afangaro ireo andiany.", "method.run": "Mba hamoronana PNG sy GeoTIFF taloha/vaovao, alefaso ny python trend_analyzer.py rehefa tafiditra amin’ny Earth Engine. Hiseho ao amin’ny assets/ ny rakitra ary eo amin’ny tabilao ny rohy fampidinana. Ampiasao amin’ny QGIS na rindran-tsary ny GeoTIFF; fijerena haingana ihany no an’ny sary Web.",
      "about.kicker": "Momba ny tetikasa", "about.title": "PlanetCred — Faharanitan-tsaina momba ny fandinihana ny Tany", "about.body": "Ampifandraisin’ny PlanetCred DI amin’ny fandinihana zanabolana ny hetsika momba ny toetrandro notaterin’ny vondrom-piarahamonina, mba hahamora ny fijerena porofo sy fironana ara-tontolo iainana amin’ny toerana iray.", "about.event": "Natao ho an’ny NASA Space Apps 2026 · Port Louis", "projects.title": "Tetikasa voasoratra", "projects.body": "Jereo ao amin’ny tabilao ny hetsika momba ny toetrandro tarihin’ny vondrom-piarahamonina sy ny porofo avy amin’ny fandinihana ny Tany.", "projects.wasteManagement": "Fitantanana ny fako",
    },
    ig: {
      "brand.tagline": "Nnyocha na ọgụgụ isi gbasara Ụwa", "nav.systemReady": "● Sistemụ dị njikere", "nav.menu": "Menu", "nav.open": "Mepee menu ntụgharị", "nav.close": "Mechie menu ntụgharị", "nav.title": "Ntụgharị", "nav.dashboard": "Dashboard", "nav.projects": "Projects", "nav.methodology": "Usoro ọrụ", "nav.about": "Banyere PlanetCred", "nav.footer": "Nnyocha Ụwa maka omume ihu igwe e nyochara.", "nav.language": "Asụsụ",
      "common.back": "← Dashboard", "common.openDashboard": "Mepee dashboard ọrụ", "common.explore": "Gaa na weebụsaịtị anyị →", "common.loading": "A na-ebunye ọrụ…", "common.unavailable": "Data ọrụ adịghị",
      "project.select": "Họrọ ọrụ e debanyere aha", "project.title": "Ndozigharị ọhịa Ebony Forest", "project.pendingOption": "Ọrụ nke abụọ (data ka na-echere)", "project.pendingTitle": "Data ọrụ ka na-echere", "project.pendingStatus": "Data ka na-echere", "project.pendingDescription": "E nyebeghị ozi gbasara ọrụ a.", "project.publicSources": "Naanị isi mmalite ọha", "project.organization": "Òtù:", "project.coordinates": "Nchịkọta ọnọdụ:", "project.startDate": "Ụbọchị mmalite:", "project.description": "Ebony Forest na-eweghachi ọhịa ụmụ amaala Chamarel, Mauritius site n’ịchịkwa osisi ndị mbịara na-awakpo, ịmụba ụdị osisi obodo na ịkụ ha. Foto ọha bụ ihe atụ, ọ bụghị ihe akaebe nyocha obodo.", "project.analysisExtent": "Mpaghara nyocha satịlaịtị (radius 400 m; oke mpụta)",
      "proof.title": "Ihe akaebe obodo", "proof.empty": "Etinyebeghị ihe akaebe obodo.", "proof.source": "ISI MMALITE", "proof.inspect": "Nyochaa", "proof.planting": "Ịkụ osisi na Ebony Forest", "proof.saplings": "Ndozigharị ọhịa site na mkpụrụ osisi", "proof.method": "Usoro ndozigharị", "proof.forest": "Ndozigharị ọhịa na Mauritius", "proof.fieldPhoto": "Foto ubi bụ ihe atụ", "proof.forestPhoto": "Foto ndozigharị ọhịa bụ ihe atụ", "proof.organizationSource": "Isi mmalite òtù", "proof.projectPhoto": "Foto ọrụ bụ ihe atụ", "proof.plantingNote": "Foto Norwich Research Park bipụtara; isi mmalite kwuru na e mere ịkụ osisi na Ebony Forest. Nke a abụghị ndekọ nyocha ọrụ.", "proof.saplingNote": "Foto dị na ntuziaka Ebony Forest nke otu ọzọ; ọ bụ ihe atụ, ọ bụghị ndekọ nyocha nwere ụbọchị.", "proof.methodNote": "Foto usoro ndozigharị Chamarel si n’ihe ngosi; ọ bụ ihe atụ, ọ bụghị akara nyocha Ebony Forest.", "proof.forestNote": "Foto Norwich Research Park bipụtara; ọ bụ ihe atụ, ọ bụghị ndekọ nyocha ọrụ.", "proof.auditLog": "Ndekọ isi mmalite",
      "metric.variable": "Ihe a tụrụ", "metric.ndvi": "NDVI (ahịhịa na osisi)", "metric.datasetPlaceholder": "Dataset: na-eche nyocha", "metric.datasetLandsat": "NASA Landsat 8 Collection 2 Level-2 (ntụgharị ìhè elu ala)", "metric.trend": "Ụzọ mgbanwe", "metric.period": "Oge:", "metric.firstLast": "Mgbanwe NDVI site na mmalite ruo na njedebe:", "metric.significance": "Mkpa ọnụ ọgụgụ", "metric.pValue": "Uru p Mann–Kendall:", "metric.significant": "Dị mkpa (p < 0.05)", "metric.notSignificant": "Adịghị mkpa", "trend.increasing": "NA-ABAWANYE", "trend.decreasing": "NA-ADALATA", "trend.noTrend": "ENWEGHỊ MGbanwe",
      "map.title": "Ọnọdụ mpaghara na ntụnyere satịlaịtị", "map.region": "Maapụ ọrụ a na-emekọrịta ihe", "map.periodPending": "A ga-ebunye oge ntụnyere site na data nyocha.", "map.windows": "Oge nchịkọta onyonyo: {before} | {after}", "map.windowTitle": "Oge nchịkọta onyonyo: {range}", "map.beforeDefault": "Oyiyi tupu", "map.afterDefault": "Oyiyi mgbe", "map.before": "Oyiyi tupu ({year})", "map.after": "Oyiyi mgbe ({year})", "map.projectPopup": "Mpaghara nyocha Ebony Forest",
      "chart.title": "Nlele NDVI Landsat 8 na mgbanwe agbakọrọ ({first}–{last})", "chart.initialTitle": "Nlele NDVI Landsat 8 na mgbanwe", "chart.aria": "Ụkpụrụ NDVI Landsat 8 ka oge na-aga", "chart.observed": "Nlele NDVI Landsat 8 (n={count})", "chart.fitted": "Mgbanwe ahịrị sitere na data nlele", "chart.note": "NDVI na-egosi akwụkwọ ndụ ahịhịa. Mgbanwe na-arị elu naanị ya anaghị egosi na ọrụ ahụ kpatara ya.", "metric.deltaFormat": "{delta} NDVI ({percent}%)",
      "imagery.title": "Onyonyo zuru ezu · Sentinel‑2", "imagery.subtitle": "Onyonyo RGB jikọtara ọnụ, pikselụ 10 m. Budata GeoTIFF ka ịlele ya na mpụga map ahụ.", "imagery.pixel": "10 m / pikselụ", "imagery.reference": "Ntụnyere", "imagery.recent": "Nke ọhụrụ", "imagery.alt": "Nlele onyonyo Sentinel‑2 {period} na pikselụ 10 m", "imagery.download": "GeoTIFF", "imagery.note": "GeoTIFF nwere agba uhie, akwụkwọ ndụ na anụnụ anụnụ na UTM 40S. Pikselụ 10 m enweghị ike igosi osisi n’otu n’otu; onyonyo ikuku ma ọ bụ nke azụmahịa nwere ikike dị mkpa maka nkọwa dị nso na mita.",
      "milestone.title": "Ndekọ nkwenye ọkwa ọrụ", "milestone.eo": "Ekwenyere site na satịlaịtị", "milestone.ground": "Ekwenyere n’ala", "milestone.empty": "Enweghị ndekọ ọkwa ọrụ.", "milestone.sitePrep": "Ọkwa 1 (ịkwadebe ebe ahụ)", "milestone.planting": "Ọkwa 2 (ịkụ osisi mbụ)", "milestone.monitoring": "Ọkwa 3 (mmezi na nlekota)",
      "method.title": "Nhicha data", "method.kicker": "Usoro satịlaịtị", "method.intro": "Ịhọrọ naanị onyonyo nwere obere pasent igwe ojii n’ozuzu ezughị. Usoro a na-ewepụ pikselụ na-adịghị mma, tụọ mpaghara doro anya na Chamarel, ma jikọta pikselụ dị mma site n’ihe oyiyi dị iche iche.", "method.qaTitle": "1. Nyocha ịdị mma Landsat", "method.qaBody": "Na QA_PIXEL, wepụ bits 0–5: oghere data, igwe ojii gbasawanyere, cirrus, igwe ojii, onyinyo igwe ojii na snow/ice. Na QA_RADSAT, wepụ pikselụ uhie/NIR juputara na ọkụ na ndị ugwu kpuchiri.", "method.coverageTitle": "2. Mpaghara doro anya n’ebe ahụ", "method.coverageBody": "Tụọ oke ala ka dị mma mgbe nhicha gasịrị. Script ahụ na-edobe nlele ma ọ bụrụ na opekata mpe 60% nke mpaghara ahụ nwere data. Nke a bara uru karịa CLOUD_COVER nke na-atụle onyonyo niile.", "method.compositeTitle": "3. Nchịkọta onyonyo tupu / mgbe", "method.compositeBody": "Maka ngosipụta, script ahụ na-eji etiti data pikselụ doro anya kwa afọ (2015 na 2025 ruo ugbu a). A na-ewepụ igwe ojii na-adịgide adịgide; anaghị eji uru e chepụtara dochie ha. Faịlụ ndị emepụtara bụ landsat_before.png na landsat_after.png.", "method.resolutionTitle": "4. Mkpebi onyonyo na mbugharị", "method.resolutionBody": "VIIRS GIBS ugbu a bụ 250 m kwa pikselụ. Maka mpaghara ọrụ ahụ, script ahụ na-emepụta Sentinel‑2 10 m na GeoTIFF RGB enwere ike ibudata. Ọ na-eme ka ubi na mkpuchi ọhịa doo anya karịa, mana ọ naghị egosi osisi otu otu. Onyonyo Google Earth nke dị nso otu mita chọrọ data ikuku ma ọ bụ azụmahịa nwere ikike.", "method.constraintsTitle": "Ihe mgbochi ndị ọzọ", "method.constraintsBody": "Igwe ojii dị gịrịgịrị, haze, onyinyo ugwu, pikselụ juputara, mmiri, obere nlele na oge afọ nwere ike imetụta NDVI. Tụnyere otu oge afọ, tụọ mkpuchi pikselụ doro anya, dekọọ ụbọchị, ma etinyela ụkpụrụ n’etiti nnukwu oghere. A na-eji Sentinel‑2 maka onyonyo 10 m; usoro NDVI ka bụ Landsat 8 30 m, a naghị agwakọta usoro abụọ ahụ.", "method.run": "Iji mepụta PNG na GeoTIFF tupu/mgbe, gbaa python trend_analyzer.py mgbe ị banyere na Earth Engine. A ga-ede faịlụ na assets/ ma njikọ nbudata apụta na dashboard. Jiri GeoTIFF na QGIS ma ọ bụ ngwanrọ onyonyo; web preview bụ maka ilele ngwa ngwa.",
      "about.kicker": "Banyere ọrụ ahụ", "about.title": "PlanetCred — Nnyocha ọgụgụ isi gbasara Ụwa", "about.body": "PlanetCred DI na-ejikọta omume ihu igwe obodo kọrọ na nlele satịlaịtị, ka o wee dị mfe inyocha ihe akaebe ọrụ na mgbanwe gburugburu ebe obibi n’otu ebe.", "about.event": "E mere ya maka NASA Space Apps 2026 · Port Louis", "projects.title": "Ọrụ e debanyere aha", "projects.body": "Nyochaa omume ihu igwe obodo na ihe akaebe nlele Ụwa ha na dashboard.", "projects.wasteManagement": "Nlekọta mkpofu",
    },
  };

  const wasteTranslations = {
    en: {
      "login.documentTitle": "PlanetCred DI | Sign in", "login.kicker": "Authentication", "login.heading": "Sign in to PlanetCred", "login.description": "Enter your account credentials to open the Earth observation dashboard.", "login.username": "Username", "login.password": "Password", "login.showPassword": "Show", "login.hidePassword": "Hide", "login.submit": "Sign in", "login.signingIn": "Signing in?", "login.invalidCredentials": "Incorrect username or password.", "login.tooManyAttempts": "Too many sign-in attempts. Wait and try again.", "login.serverUnavailable": "Authentication service unavailable. Start the app using the PlanetCred server.", "waste.documentTitle": "PlanetCred DI | Waste Management", "waste.kicker": "Open registries · NASA Earth observations", "waste.title": "Waste Management & Climate Context", "waste.intro": "Explore mapped waste facilities alongside regional climate records and satellite temperature imagery.", "waste.searchLabel": "Search a country or city", "waste.searchPlaceholder": "Enter a country or city", "waste.searchButton": "Scan NASA & Open Data", "waste.loading": "Loading location and climate data…", "waste.indicators": "Regional indicators", "waste.kpiClimate": "NASA POWER climate data", "waste.dailyMax": "Daily maximum air temperature", "waste.kpiRegistry": "OpenStreetMap waste registry", "waste.osmNote": "Facilities reported by OpenStreetMap contributors", "waste.kpiChange": "Regional temperature change", "waste.mapTitle": "Waste Facilities & NASA Thermal Layer", "waste.mapLegend": "Heat levels: green = low, yellow = moderate, orange = high · Amber markers show waste sites", "waste.mapAria": "Waste facility and satellite temperature map", "waste.tableTitle": "Open Waste Facilities & Regional Climate Context", "waste.tableSite": "Site name & coordinates", "waste.tableType": "OSM feature type", "waste.tableSource": "Registry source", "waste.tableChange": "Regional change", "waste.summaryTitle": "Automated Regional Summary", "waste.summarySubtitle": "NASA POWER climate context and OpenStreetMap waste locations", "waste.export": "Export report (.xlsx)", "waste.legendTitle": "Heat intensity guide", "waste.legendLow": "Low level", "waste.legendModerate": "Moderate level", "waste.legendHigh": "High level", "waste.limitTitle": "Scientific interpretation & limitations", "waste.limitText": "Waste locations come from OpenStreetMap. NASA POWER values are regional annual means of daily maximum air temperature, not measurements at each facility. The MODIS land-surface temperature layer is a satellite visualization and should not be interpreted as a facility-level reading or proof that waste caused local heating.", "waste.siteCount": "{count} mapped site{plural}", "waste.regionalNote": "Regional NASA POWER annual mean daily maximum air temperature · {baselineYear} vs {currentYear}", "waste.climatePeriod": "Annual mean ? {baselineYear} vs {currentYear}", "waste.tableBaselineDefault": "Regional mean T2M_MAX (2015)", "waste.tableLatestDefault": "Regional mean T2M_MAX (latest year)", "waste.tableLatest": "Regional mean T2M_MAX ({year})", "waste.noSites": "No mapped waste facilities were found in this area.", "waste.tryWider": "Try a wider search area or another location.", "waste.openRecord": "OpenStreetMap record", "waste.tableWaiting": "Waiting for location data…", "waste.summaryClimate": "Regional climate context", "waste.summaryClimateChange": "The regional annual mean of daily maximum air temperature changed by {change} between {baselineYear} and {currentYear}.", "waste.summaryClimateUnavailable": "The regional temperature comparison is unavailable.", "waste.summaryPoint": "This is NASA POWER point data for the search location.", "waste.summaryRegistry": "Open waste registry", "waste.summarySites": "{count} waste location{plural} returned by OpenStreetMap for this search area.", "waste.summaryInterpretation": "Interpretation", "waste.summaryLimits": "Regional air temperature and MODIS land-surface temperature do not establish a facility-level heat anomaly or a causal link to waste.", "waste.searching": "Searching public registries and NASA POWER for “{query}”…", "waste.locationNotFound": "Location not found: {query}", "waste.statusPartial": "{problems}. Showing available data for {location}.", "waste.statusLoaded": "Loaded {count} OpenStreetMap waste location{plural} and NASA POWER climate data for {location}.", "waste.osmUnavailable": "OpenStreetMap facilities could not be loaded", "waste.nasaUnavailable": "NASA POWER climate data could not be loaded", "waste.statusError": "Could not load this location: {message}. Check the place name or connection and try again.", "waste.exportUnavailable": "The spreadsheet library could not be loaded. Check your internet connection and try again.", "waste.exportEmpty": "No OpenStreetMap waste facilities were found in the search area.", "waste.baseSatellite": "Satellite imagery", "waste.thermalLayer": "NASA MODIS daytime land-surface temperature", "waste.tempUnavailable": "Unavailable", "waste.tableOsm": "OpenStreetMap", "waste.facilityLandfill": "Landfill", "waste.facilityTransfer": "Waste transfer station", "waste.facilityDisposal": "Waste disposal site", "waste.facilityRecycling": "Recycling centre", "waste.facilityOther": "Waste facility", "waste.exportSheet": "Waste and Climate Data", "waste.exportLocation": "Location", "waste.exportName": "Facility name", "waste.exportType": "Facility type", "waste.exportRecord": "OpenStreetMap record", "waste.exportBaseline": "Regional NASA POWER mean daily maximum temperature (2015, °C)", "waste.exportCurrent": "Regional NASA POWER mean daily maximum temperature ({year}, °C)",
    },
    fr: {
      "login.documentTitle": "PlanetCred DI | Connexion", "login.kicker": "Acc?s s?curis?", "login.heading": "Connectez-vous ? PlanetCred", "login.description": "Saisissez vos identifiants pour ouvrir le tableau de bord d?observation de la Terre.", "login.username": "Nom d?utilisateur", "login.password": "Mot de passe", "login.showPassword": "Afficher", "login.hidePassword": "Masquer", "login.submit": "Se connecter", "login.signingIn": "Connexion?", "login.invalidCredentials": "Nom d?utilisateur ou mot de passe incorrect.", "login.tooManyAttempts": "Trop de tentatives. Attendez avant de r?essayer.", "login.serverUnavailable": "Serveur d?authentification indisponible. Lancez l?application avec le serveur PlanetCred.", "waste.documentTitle": "PlanetCred DI | Gestion des déchets", "waste.kicker": "Registres ouverts · Observations de la Terre de la NASA", "waste.title": "Gestion des déchets et contexte climatique", "waste.intro": "Explorez les installations de déchets cartographiées, les données climatiques régionales et l’imagerie thermique satellitaire.", "waste.searchLabel": "Rechercher un pays ou une ville", "waste.searchPlaceholder": "Saisissez un pays ou une ville", "waste.searchButton": "Rechercher dans les données ouvertes et NASA", "waste.loading": "Chargement du lieu et des données climatiques…", "waste.indicators": "Indicateurs régionaux", "waste.kpiClimate": "Données climatiques NASA POWER", "waste.dailyMax": "Température maximale quotidienne de l’air", "waste.kpiRegistry": "Registre des déchets OpenStreetMap", "waste.osmNote": "Installations signalées par les contributeurs OpenStreetMap", "waste.kpiChange": "Variation régionale de température", "waste.mapTitle": "Installations de déchets et couche thermique NASA", "waste.mapLegend": "Niveaux thermiques : vert = faible, jaune = modéré, orange = élevé · Les marqueurs ambre indiquent les sites de déchets", "waste.mapAria": "Carte des installations de déchets et des températures satellitaires", "waste.tableTitle": "Installations de déchets et contexte climatique régional", "waste.tableSite": "Nom du site et coordonnées", "waste.tableType": "Type d’objet OSM", "waste.tableSource": "Source du registre", "waste.tableChange": "Variation régionale", "waste.summaryTitle": "Résumé régional automatisé", "waste.summarySubtitle": "Contexte climatique NASA POWER et sites de déchets OpenStreetMap", "waste.export": "Exporter le rapport (.xlsx)", "waste.legendTitle": "Légende de l’intensité thermique", "waste.legendLow": "Niveau faible", "waste.legendModerate": "Niveau modéré", "waste.legendHigh": "Niveau élevé", "waste.limitTitle": "Interprétation scientifique et limites", "waste.limitText": "Les sites de déchets proviennent d’OpenStreetMap. Les valeurs NASA POWER sont des moyennes annuelles régionales des températures maximales quotidiennes de l’air, et non des mesures prises dans chaque installation. La couche MODIS représente la température de surface vue par satellite; elle ne prouve ni une anomalie thermique propre à un site ni un lien causal avec les déchets.", "waste.siteCount": "{count} site{plural} cartographié{plural}", "waste.regionalNote": "Moyenne annuelle régionale NASA POWER des températures maximales · {baselineYear} contre {currentYear}", "waste.climatePeriod": "Moyenne annuelle ? {baselineYear} contre {currentYear}", "waste.tableBaselineDefault": "Moyenne r?gionale T2M_MAX (2015)", "waste.tableLatestDefault": "Moyenne r?gionale T2M_MAX (derni?re ann?e)", "waste.tableLatest": "Moyenne régionale T2M_MAX ({year})", "waste.noSites": "Aucune installation de déchets cartographiée dans cette zone.", "waste.tryWider": "Essayez une zone plus large ou un autre lieu.", "waste.openRecord": "Ouvrir la fiche OpenStreetMap", "waste.tableWaiting": "En attente des données du lieu…", "waste.summaryClimate": "Contexte climatique régional", "waste.summaryClimateChange": "La moyenne annuelle régionale des températures maximales quotidiennes a varié de {change} entre {baselineYear} et {currentYear}.", "waste.summaryClimateUnavailable": "La comparaison régionale des températures est indisponible.", "waste.summaryPoint": "Il s’agit des données ponctuelles NASA POWER du lieu recherché.", "waste.summaryRegistry": "Registre ouvert des déchets", "waste.summarySites": "OpenStreetMap a renvoyé {count} site{plural} dans cette zone.", "waste.summaryInterpretation": "Interprétation", "waste.summaryLimits": "La température régionale de l’air et la température de surface MODIS ne suffisent pas à établir une anomalie thermique à l’échelle d’un site ni un lien de causalité avec les déchets.", "waste.searching": "Recherche dans les registres publics et NASA POWER pour « {query} »…", "waste.locationNotFound": "Lieu introuvable : {query}", "waste.statusPartial": "{problems}. Affichage des données disponibles pour {location}.", "waste.statusLoaded": "{count} site{plural} OpenStreetMap et les données climatiques NASA POWER ont été chargés pour {location}.", "waste.osmUnavailable": "Impossible de charger les installations OpenStreetMap", "waste.nasaUnavailable": "Impossible de charger les données climatiques NASA POWER", "waste.statusError": "Impossible de charger ce lieu : {message}. Vérifiez son nom ou la connexion, puis réessayez.", "waste.exportUnavailable": "La bibliothèque de tableur n’a pas pu être chargée. Vérifiez votre connexion, puis réessayez.", "waste.exportEmpty": "Aucune installation OpenStreetMap dans la zone recherchée.", "waste.baseSatellite": "Imagerie satellite", "waste.thermalLayer": "Température de surface diurne NASA MODIS", "waste.tempUnavailable": "Indisponible", "waste.tableOsm": "OpenStreetMap", "waste.facilityLandfill": "Décharge", "waste.facilityTransfer": "Centre de transfert des déchets", "waste.facilityDisposal": "Site d’élimination des déchets", "waste.facilityRecycling": "Centre de recyclage", "waste.facilityOther": "Installation de déchets", "waste.exportSheet": "Déchets et climat", "waste.exportLocation": "Lieu", "waste.exportName": "Nom de l’installation", "waste.exportType": "Type d’installation", "waste.exportRecord": "Fiche OpenStreetMap", "waste.exportBaseline": "Moyenne régionale NASA POWER des températures maximales (2015, °C)", "waste.exportCurrent": "Moyenne régionale NASA POWER des températures maximales ({year}, °C)",
    },
    mg: {
      "login.documentTitle": "PlanetCred DI | Fidirana", "login.kicker": "Fidirana azo antoka", "login.heading": "Midira ao amin?ny PlanetCred", "login.description": "Ampidiro ny mombamomba ny kaontinao mba hanokafana ny tabilao fandinihana ny Tany.", "login.username": "Anaran?ny mpampiasa", "login.password": "Tenimiafina", "login.showPassword": "Asehoy", "login.hidePassword": "Afeno", "login.submit": "Midira", "login.signingIn": "Miditra?", "login.invalidCredentials": "Diso ny anaran?ny mpampiasa na ny tenimiafina.", "login.tooManyAttempts": "Be loatra ny andrana. Miandrasa kely dia andramo indray.", "login.serverUnavailable": "Tsy misy ny mpizara fidirana. Alefaso amin?ny alalan?ny mpizara PlanetCred ny app.", "waste.documentTitle": "PlanetCred DI | Fitantanana ny fako", "waste.kicker": "Loharano misokatra · Fandinihana ny Tany NASA", "waste.title": "Fitantanana ny fako sy ny toetrandro", "waste.intro": "Jereo ny toerana fanariam-pako voasoratra, ny angona momba ny toetrandro isam-paritra ary ny sary hafanana avy amin’ny zanabolana.", "waste.searchLabel": "Mitadiava firenena na tanàna", "waste.searchPlaceholder": "Ampidiro ny firenena na tanàna", "waste.searchButton": "Karohy ny angona misokatra sy NASA", "waste.loading": "Mameno ny toerana sy ny angona momba ny toetrandro…", "waste.indicators": "Mari-pandrefesana isam-paritra", "waste.kpiClimate": "Angona momba ny toetrandro NASA POWER", "waste.dailyMax": "Hafanana ambony indrindra isan’andro amin’ny rivotra", "waste.kpiRegistry": "Tahirin-toerana fako OpenStreetMap", "waste.osmNote": "Toerana nampidirin’ny mpandray anjara OpenStreetMap", "waste.kpiChange": "Fiovan’ny hafanana isam-paritra", "waste.mapTitle": "Toerana fako sy sosona hafanana NASA", "waste.mapLegend": "Haavon’ny hafanana: maitso = ambany, mavo = antonony, volomboasary = avo · Ny marika volomboasary dia toerana fako", "waste.mapAria": "Sarintanin’ny toerana fako sy hafanana avy amin’ny zanabolana", "waste.tableTitle": "Toerana fako sy toetrandro isam-paritra", "waste.tableSite": "Anaran-toerana sy fandrindrana", "waste.tableType": "Karazana zavatra OSM", "waste.tableSource": "Loharanon’ny tahiry", "waste.tableChange": "Fiovana isam-paritra", "waste.summaryTitle": "Famintinana isam-paritra mandeha ho azy", "waste.summarySubtitle": "Angona toetrandro NASA POWER sy toerana fako OpenStreetMap", "waste.export": "Avoahy ny tatitra (.xlsx)", "waste.legendTitle": "Torolalana momba ny hamafin’ny hafanana", "waste.legendLow": "Ambany", "waste.legendModerate": "Antonony", "waste.legendHigh": "Avo", "waste.limitTitle": "Fandikana ara-tsiansa sy fetra", "waste.limitText": "Avy amin’ny OpenStreetMap ny toerana fako. Salan’isa isan-taona isam-paritra amin’ny hafanana ambony indrindra isan’andro ireo sanda NASA POWER, fa tsy fandrefesana isaky ny toerana. Sary zanabolana momba ny hafanan’ny velaran-tany ny sosona MODIS; tsy porofo momba ny hafanana amin’ny toerana tsirairay na antony avy amin’ny fako izany.", "waste.siteCount": "Toerana {count} voasoratra", "waste.regionalNote": "Salan’isa isan-taona NASA POWER isam-paritra · {baselineYear} sy {currentYear}", "waste.climatePeriod": "Salan?isa isan-taona ? {baselineYear} sy {currentYear}", "waste.tableBaselineDefault": "Salan?isa isam-paritra T2M_MAX (2015)", "waste.tableLatestDefault": "Salan?isa isam-paritra T2M_MAX (taona farany)", "waste.tableLatest": "Salan’isa isam-paritra T2M_MAX ({year})", "waste.noSites": "Tsy nahitana toerana fako voasoratra eto amin’ity faritra ity.", "waste.tryWider": "Andramo faritra lehibe kokoa na toerana hafa.", "waste.openRecord": "Sokafy ny rakitra OpenStreetMap", "waste.tableWaiting": "Miandry ny angon-drakitra momba ny toerana…", "waste.summaryClimate": "Toe-javatra ara-toetrandro isam-paritra", "waste.summaryClimateChange": "Niova {change} ny salan’isan’ny hafanana ambony indrindra isan’andro teo anelanelan’ny {baselineYear} sy {currentYear}.", "waste.summaryClimateUnavailable": "Tsy misy ny fampitahana ny hafanana isam-paritra.", "waste.summaryPoint": "Angona teboka NASA POWER ho an’ny toerana notadiavina ity.", "waste.summaryRegistry": "Tahiry fako misokatra", "waste.summarySites": "Toerana fako {count} no naverin’ny OpenStreetMap ho an’ity faritra ity.", "waste.summaryInterpretation": "Fandikana", "waste.summaryLimits": "Tsy manaporofo hafanana tafahoatra amin’ny toerana iray na fifandraisana antony sy vokany amin’ny fako ny hafanan’ny rivotra isam-paritra sy ny hafanan’ny velaran-tany MODIS.", "waste.searching": "Mikaroka ny tahiry misokatra sy NASA POWER momba an’i {query}…", "waste.locationNotFound": "Tsy hita ilay toerana: {query}", "waste.statusPartial": "{problems}. Asehoy ny angona misy ho an’i {location}.", "waste.statusLoaded": "Voaray ny toerana fako {count} avy amin’ny OpenStreetMap sy ny angona NASA POWER ho an’i {location}.", "waste.osmUnavailable": "Tsy afaka nampiditra ny toerana OpenStreetMap", "waste.nasaUnavailable": "Tsy afaka nampiditra ny angona toetrandro NASA POWER", "waste.statusError": "Tsy afaka nampiditra ity toerana ity: {message}. Hamarino ny anarany na ny fifandraisana, dia andramo indray.", "waste.exportUnavailable": "Tsy voaray ny fitaovana spreadsheet. Hamarino ny fifandraisana Internet dia andramo indray.", "waste.exportEmpty": "Tsy nahitana toerana fako OpenStreetMap tao amin’ny faritra.", "waste.baseSatellite": "Sary zanabolana", "waste.thermalLayer": "Hafanan’ny velaran-tany antoandro NASA MODIS", "waste.tempUnavailable": "Tsy misy", "waste.tableOsm": "OpenStreetMap", "waste.facilityLandfill": "Fanariam-pako", "waste.facilityTransfer": "Toerana famindrana fako", "waste.facilityDisposal": "Toerana fanariana fako", "waste.facilityRecycling": "Toerana fanodinana fako", "waste.facilityOther": "Toerana fako", "waste.exportSheet": "Fako sy toetrandro", "waste.exportLocation": "Toerana", "waste.exportName": "Anaran-toerana", "waste.exportType": "Karazana toerana", "waste.exportRecord": "Rakitra OpenStreetMap", "waste.exportBaseline": "Salan’isa NASA POWER isam-paritra (2015, °C)", "waste.exportCurrent": "Salan’isa NASA POWER isam-paritra ({year}, °C)",
    },
    ig: {
      "login.documentTitle": "PlanetCred DI | Nbanye", "login.kicker": "Nchekwa nbanye", "login.heading": "Banye na PlanetCred", "login.description": "Tinye aha njirimara na okwuntughe gi ka imepee dashboard nlele ?wa.", "login.username": "Aha njirimara", "login.password": "Okwuntughe", "login.showPassword": "Gosi", "login.hidePassword": "Zoo", "login.submit": "Banye", "login.signingIn": "A na-abanye?", "login.invalidCredentials": "Aha njirimara ma ? b? okwuntughe ezighi ezi.", "login.tooManyAttempts": "? nwara ?t?t? ugboro. Chere tupu ? nwaa ?z?.", "login.serverUnavailable": "Sava nbanye ad?gh?. Jiri sava PlanetCred malite ngwa a.", "waste.documentTitle": "PlanetCred DI | Nlekọta mkpofu", "waste.kicker": "Ndebanye ọha · Nlele NASA nke Ụwa", "waste.title": "Nlekọta mkpofu na ọnọdụ ihu igwe", "waste.intro": "Nyochaa ebe mkpofu edebanyere na maapụ, data ihu igwe mpaghara na onyonyo okpomọkụ satịlaịtị.", "waste.searchLabel": "Chọọ obodo ma ọ bụ obodo nta", "waste.searchPlaceholder": "Tinye aha obodo", "waste.searchButton": "Chọọ NASA na data ọha", "waste.loading": "A na-ebunye ebe na data ihu igwe…", "waste.indicators": "Ihe ngosi mpaghara", "waste.kpiClimate": "Data ihu igwe NASA POWER", "waste.dailyMax": "Okpomọkụ ikuku kachasị elu kwa ụbọchị", "waste.kpiRegistry": "Ndebanye mkpofu OpenStreetMap", "waste.osmNote": "Ebe ndị sonyere OpenStreetMap kọrọ", "waste.kpiChange": "Mgbanwe okpomọkụ mpaghara", "waste.mapTitle": "Ebe mkpofu na oyi akwa okpomọkụ NASA", "waste.mapLegend": "Nduzi ogo okpomọụ: Ọkwa dị ala, odo = etiti, oroma = elu · Akara oroma na-egosi ebe mkpofu", "waste.mapAria": "Maapụ ebe mkpofu na okpomọkụ satịlaịtị", "waste.tableTitle": "Ebe mkpofu ọha na ọnọdụ ihu igwe mpaghara", "waste.tableSite": "Aha ebe na nhazi ọnọdụ", "waste.tableType": "Ụdị ihe OSM", "waste.tableSource": "Isi mmalite ndebanye", "waste.tableChange": "Mgbanwe mpaghara", "waste.summaryTitle": "Nchịkọta mpaghara akpaghị aka", "waste.summarySubtitle": "Ọnọdụ ihu igwe NASA POWER na ebe mkpofu OpenStreetMap", "waste.export": "Budata akụkọ (.xlsx)", "waste.legendTitle": "Nduzi ogo okpomọkụ", "waste.legendLow": "Ọkwa dị ala", "waste.legendModerate": "Ọkwa etiti", "waste.legendHigh": "Ọkwa dị elu", "waste.limitTitle": "Nkọwa sayensị na oke ya", "waste.limitText": "Ebe mkpofu sitere na OpenStreetMap. Uru NASA POWER bụ nkezi kwa afọ nke okpomọkụ ikuku kachasị elu kwa ụbọchị na mpaghara, ọ bụghị nha sitere n’ebe ọ bụla. Oyi akwa MODIS bụ onyonyo okpomọkụ elu ala satịlaịtị; ọ bụghị ihe akaebe okpomọkụ kpọmkwem n’ebe ọrụ ma ọ bụ na mkpofu kpatara ya.", "waste.siteCount": "Ebe {count} dị na maapụ", "waste.regionalNote": "Nkezi kwa afọ NASA POWER mpaghara · {baselineYear} na {currentYear}", "waste.climatePeriod": "Nkezi kwa af? ? {baselineYear} na {currentYear}", "waste.tableBaselineDefault": "Nkezi mpaghara T2M_MAX (2015)", "waste.tableLatestDefault": "Nkezi mpaghara T2M_MAX (af? kacha ?h?r?)", "waste.tableLatest": "Nkezi mpaghara T2M_MAX ({year})", "waste.noSites": "Ahụghị ebe mkpofu edebanyere na mpaghara a.", "waste.tryWider": "Gbalịa mpaghara ka obosara ma ọ bụ ebe ọzọ.", "waste.openRecord": "Mepee ndekọ OpenStreetMap", "waste.tableWaiting": "Na-eche data ebe…", "waste.summaryClimate": "Ọnọdụ ihu igwe mpaghara", "waste.summaryClimateChange": "Nkezi mpaghara nke okpomọkụ kachasị elu kwa ụbọchị gbanwere {change} n’etiti {baselineYear} na {currentYear}.", "waste.summaryClimateUnavailable": "Ntụnyere okpomọkụ mpaghara adịghị.", "waste.summaryPoint": "Nke a bụ data NASA POWER maka ebe a chọpụtara.", "waste.summaryRegistry": "Ndebanye mkpofu ọha", "waste.summarySites": "OpenStreetMap weghachiri ebe mkpofu {count} maka mpaghara a.", "waste.summaryInterpretation": "Nkọwa", "waste.summaryLimits": "Okpomọkụ ikuku mpaghara na okpomọkụ elu ala MODIS anaghị egosi anomaly okpomọkụ n’otu ebe ma ọ bụ njikọ kpatara ya na mkpofu.", "waste.searching": "A na-achọ {query} na ndebanye ọha na NASA POWER…", "waste.locationNotFound": "Ahụghị ebe a: {query}", "waste.statusPartial": "{problems}. A na-egosi data dị maka {location}.", "waste.statusLoaded": "Ebugoro ebe mkpofu OpenStreetMap {count} na data ihu igwe NASA POWER maka {location}.", "waste.osmUnavailable": "Enweghị ike ibunye ebe OpenStreetMap", "waste.nasaUnavailable": "Enweghị ike ibunye data ihu igwe NASA POWER", "waste.statusError": "Enweghị ike ibunye ebe a: {message}. Lelee aha ya ma ọ bụ njikọ Internet, gbalịa ọzọ.", "waste.exportUnavailable": "Enweghị ike ibunye ngwa spreadsheet. Lelee njikọ Internet, gbalịa ọzọ.", "waste.exportEmpty": "Ahụghị ebe mkpofu OpenStreetMap na mpaghara ọchụchọ a.", "waste.baseSatellite": "Onyonyo satịlaịtị", "waste.thermalLayer": "Okpomọkụ elu ala ehihie NASA MODIS", "waste.tempUnavailable": "Adịghị", "waste.tableOsm": "OpenStreetMap", "waste.facilityLandfill": "Ebe a na-ekpofu ahịhịa", "waste.facilityTransfer": "Ebe nnyefe mkpofu", "waste.facilityDisposal": "Ebe mkpofu", "waste.facilityRecycling": "Ebe imegharị ihe", "waste.facilityOther": "Ebe mkpofu", "waste.exportSheet": "Mkpofu na ihu igwe", "waste.exportLocation": "Ebe", "waste.exportName": "Aha ebe ọrụ", "waste.exportType": "Ụdị ebe ọrụ", "waste.exportRecord": "Ndekọ OpenStreetMap", "waste.exportBaseline": "Nkezi NASA POWER mpaghara (2015, °C)", "waste.exportCurrent": "Nkezi NASA POWER mpaghara ({year}, °C)",
    },
  };
  Object.entries(wasteTranslations).forEach(([language, entries]) => Object.assign(translations[language], entries));

  const signupTranslations = {
    en: {
      "login.signupHeading": "Create your PlanetCred account", "login.noAccount": "No account?", "login.haveAccount": "Already have an account?", "login.signUp": "Sign Up", "login.signIn": "Sign In", "login.confirmPassword": "Confirm password", "login.createAccount": "Create account", "login.creatingAccount": "Creating account…", "login.signupValidation": "Use a username of 3–32 letters, numbers, dots, underscores, or hyphens and a password of 12–256 characters.", "login.passwordMismatch": "The passwords do not match.", "login.usernameTaken": "That username is already registered.",
    },
    fr: {
      "login.signupHeading": "Créer un compte PlanetCred", "login.noAccount": "Pas encore de compte ?", "login.haveAccount": "Vous avez déjà un compte ?", "login.signUp": "S’inscrire", "login.signIn": "Se connecter", "login.confirmPassword": "Confirmer le mot de passe", "login.createAccount": "Créer le compte", "login.creatingAccount": "Création du compte…", "login.signupValidation": "Choisissez un nom de 3 à 32 lettres, chiffres, points, tirets ou underscores et un mot de passe de 12 à 256 caractères.", "login.passwordMismatch": "Les mots de passe ne correspondent pas.", "login.usernameTaken": "Ce nom d’utilisateur est déjà enregistré.",
    },
    mg: {
      "login.signupHeading": "Mamorona kaonty PlanetCred", "login.noAccount": "Tsy mbola manana kaonty?", "login.haveAccount": "Efa manana kaonty?", "login.signUp": "Hisoratra anarana", "login.signIn": "Hiditra", "login.confirmPassword": "Hamafiso ny tenimiafina", "login.createAccount": "Mamorona kaonty", "login.creatingAccount": "Mamorona kaonty…", "login.signupValidation": "Mampiasà solon’anarana misy litera, isa, teboka, tsipika na underscore 3–32 ary tenimiafina 12–256 tarehintsoratra.", "login.passwordMismatch": "Tsy mitovy ny tenimiafina.", "login.usernameTaken": "Efa misy io solon’anarana io.",
    },
    ig: {
      "login.signupHeading": "Mepụta akaụntụ PlanetCred", "login.noAccount": "Ị nweghị akaụntụ?", "login.haveAccount": "Ị nweela akaụntụ?", "login.signUp": "Debanye aha", "login.signIn": "Banye", "login.confirmPassword": "Kwenye okwuntughe", "login.createAccount": "Mepụta akaụntụ", "login.creatingAccount": "A na-emepụta akaụntụ…", "login.signupValidation": "Jiri aha mkpụrụedemede, ọnụọgụ, ntụpọ ma ọ bụ akara 3–32 na okwuntughe mkpụrụedemede 12–256.", "login.passwordMismatch": "Okwuntughe ndị a adabaghị.", "login.usernameTaken": "Edebanyela aha njirimara a.",
    },
  };
  Object.entries(signupTranslations).forEach(([language, entries]) => Object.assign(translations[language], entries));

  const pageTranslations = {
    en: { "page.loading": "Loading satellite and project data…" },
    fr: { "page.loading": "Chargement des données satellite et du projet…" },
    mg: { "page.loading": "Mameno ny angona zanabolana sy ny tetikasa…" },
    ig: { "page.loading": "Na-ebunye data satịlaịtị na ọrụ…" },
  };
  Object.entries(pageTranslations).forEach(([language, entries]) => Object.assign(translations[language], entries));

  const publicPhotoTranslations = {
    en: {
      "proof.publicPhoto": "PUBLIC PHOTO",
      "proof.details": "Evidence details",
      "proof.viewSource": "View source",
      "proof.date": "Date",
      "proof.coordinates": "Coordinates",
      "proof.geotaggedPhoto": "Dated geotagged site photo",
      "proof.biodiversityObservation": "Dated biodiversity observation",
      "proof.walkwayTitle": "Ebony Forest walkway",
      "proof.barleriaTitle": "Barleria observatrix at Ebony Forest",
      "proof.neptisTitle": "Neptis frobenia observation",
      "proof.reservePhotoTitle": "Ebony Forest site photo",
      "proof.walkwayNote": "Public site-context photo; not proof of a restoration activity.",
      "proof.barleriaNote": "Native-plant observation; it does not establish that this plant was planted by the project.",
      "proof.neptisNote": "Camera point is inside the mapped polygon. Biodiversity evidence only, not proof of restoration work; image is focus-stacked.",
      "proof.reservePhotoNote": "Public site-context photo; camera point is outside the mapped analysis polygon.",
    },
    fr: {
      "proof.publicPhoto": "PHOTO PUBLIQUE",
      "proof.details": "Détails de la preuve",
      "proof.viewSource": "Voir la source",
      "proof.date": "Date",
      "proof.coordinates": "Coordonnées",
      "proof.geotaggedPhoto": "Photo datée et géolocalisée du site",
      "proof.biodiversityObservation": "Observation de biodiversité datée",
      "proof.walkwayTitle": "Passerelle d’Ebony Forest",
      "proof.barleriaTitle": "Barleria observatrix à Ebony Forest",
      "proof.neptisTitle": "Observation de Neptis frobenia",
      "proof.reservePhotoTitle": "Photo du site d’Ebony Forest",
      "proof.walkwayNote": "Photo publique de contexte du site; elle ne prouve pas une activité de restauration.",
      "proof.barleriaNote": "Observation d’une plante native; elle ne prouve pas que le projet l’a plantée.",
      "proof.neptisNote": "Le point photo est dans le polygone affiché. Preuve de biodiversité uniquement, pas de travaux; image issue d’un empilement de mises au point.",
      "proof.reservePhotoNote": "Photo publique de contexte; le point photo est hors du polygone d’analyse.",
    },
    mg: {
      "proof.publicPhoto": "SARY HO AN’NY BESINIMARO",
      "proof.details": "Antsipirian’ny porofo",
      "proof.viewSource": "Jereo ny loharano",
      "proof.date": "Daty",
      "proof.coordinates": "Toerana",
      "proof.geotaggedPhoto": "Sary misy daty sy toerana",
      "proof.biodiversityObservation": "Fijerena zavamananaina misy daty",
      "proof.walkwayTitle": "Lalana ambony hazo ao Ebony Forest",
      "proof.barleriaTitle": "Barleria observatrix tao Ebony Forest",
      "proof.neptisTitle": "Fijerena Neptis frobenia",
      "proof.reservePhotoTitle": "Sarin’ny toerana Ebony Forest",
      "proof.walkwayNote": "Sary ampahibemaso mampiseho ny toerana; tsy porofo fa nisy asa famerenana ala.",
      "proof.barleriaNote": "Fijerena zavamaniry zanatany; tsy manaporofo fa nambolen’ny tetikasa io zavamaniry io.",
      "proof.neptisNote": "Ao anatin’ny faritra voasaritra ny toerana nakana sary. Porofo momba ny zavamananaina ihany, tsy porofon’asa; sary natambatra avy amin’ny fifantohana maromaro.",
      "proof.reservePhotoNote": "Sary ampahibemaso mampiseho ny toerana; ivelan’ny faritra nodinihina ny toerana nakana azy.",
    },
    ig: {
      "proof.publicPhoto": "FOTO ỌHA",
      "proof.details": "Nkọwa ihe akaebe",
      "proof.viewSource": "Lee isi mmalite",
      "proof.date": "Ụbọchị",
      "proof.coordinates": "Nhazi ọnọdụ",
      "proof.geotaggedPhoto": "Foto ebe ahụ nwere ụbọchị na ọnọdụ",
      "proof.biodiversityObservation": "Nlele ụdị ndụ nwere ụbọchị",
      "proof.walkwayTitle": "Ụzọ ije Ebony Forest",
      "proof.barleriaTitle": "Barleria observatrix na Ebony Forest",
      "proof.neptisTitle": "Nlele Neptis frobenia",
      "proof.reservePhotoTitle": "Foto ebe nchekwa Ebony Forest",
      "proof.walkwayNote": "Foto ọha na-egosi ebe ahụ; ọ bụghị ihe akaebe ọrụ mweghachi.",
      "proof.barleriaNote": "Nlele osisi obodo; ọ naghị egosi na ọrụ a kụrụ osisi ahụ.",
      "proof.neptisNote": "Ebe e si see foto dị n’ime polygon ahụ. Ọ bụ ihe akaebe ụdị ndụ naanị, ọ bụghị ọrụ mweghachi; e jikọtara ọtụtụ ebe elekwasịrị anya n’onyonyo a.",
      "proof.reservePhotoNote": "Foto ọha na-egosi ebe ahụ; ebe e si see ya dị n’èzí polygon nyocha.",
    },
  };
  Object.entries(publicPhotoTranslations).forEach(([language, entries]) => Object.assign(translations[language], entries));

  const milestoneShortTranslations = {
    en: { "milestone.eoShort": "EO", "milestone.publicShort": "Site", "milestone.groundShort": "Ground" },
    fr: { "milestone.eoShort": "EO", "milestone.publicShort": "Site", "milestone.groundShort": "Terrain" },
    mg: { "milestone.eoShort": "EO", "milestone.publicShort": "Toerana", "milestone.groundShort": "Tany" },
    ig: { "milestone.eoShort": "EO", "milestone.publicShort": "Ebe", "milestone.groundShort": "Ala" },
  };
  Object.entries(milestoneShortTranslations).forEach(([language, entries]) => Object.assign(translations[language], entries));

  const milestoneUiTranslations = {
    en: {
      "milestone.context": "Satellite trends describe vegetation change; they do not verify individual project activities. Ground verification requires dated field records.",
      "milestone.public": "Site record",
      "milestone.siteRecordTooltip": "Public documentation at site level; not verified at this exact plot",
      "milestone.sourcesTitle": "Reviewed public sources and limitations",
      "milestone.siteScopeNotice": "Public reports document restoration at Ebony Forest as a whole. They do not verify work inside this mapped analysis polygon.",
      "milestone.publisher": "Publisher",
      "milestone.publicationDate": "Publication date",
      "milestone.period": "Activity period",
      "milestone.reviewedOn": "Source reviewed",
      "milestone.evidenceType": "Evidence type",
      "milestone.site": "Site",
      "milestone.coordinates": "Coordinates (lat, lon)",
      "milestone.coordinatePrecision": "Location precision",
      "milestone.notSpecified": "Not stated",
      "milestone.scope": "Evidence scope",
      "milestone.claim": "What it documents",
      "milestone.method": "Review method",
      "milestone.limitation": "Limitation",
      "milestone.license": "Reuse",
      "milestone.scope.site": "Site-level record",
      "milestone.scope.organization_method": "Organization methodology; not an activity record",
      "milestone.scope.site_visit": "Site visit; no plot-level location",
      "milestone.scope.geotagged_observation": "Geotagged observation; not proof of restoration",
      "milestone.scope.candidate_observations": "Candidate records; inspect individually",
      "milestone.scope.species_management_context": "Species-management context only",
      "milestone.type.environmental_impact_report": "Environmental impact report",
      "milestone.type.grant_final_report": "Grant final report",
      "milestone.type.ngo_annual_report": "NGO annual report",
      "milestone.type.organization_methodology": "Organization methodology",
      "milestone.type.independent_visit_report": "Independent visit report",
      "milestone.type.dated_geotagged_biodiversity_photo": "Dated geotagged biodiversity photo",
      "milestone.type.community_observation_index": "Community observation index",
      "milestone.type.peer_reviewed_scientific_article": "Peer-reviewed scientific article",
      "milestone.type.partner_organization_summary": "Partner organization summary",
      "milestone.satelliteMonitoring": "Satellite vegetation monitoring",
      "milestone.monitoringSummary": "{count} valid Landsat 8 observations ({first}–{last}); NDVI trend: {trend} (Mann–Kendall p={pValue}).",
      "milestone.verified": "Verified from the listed evidence",
      "milestone.notVerified": "No verification record",
      "milestone.viewChart": "View chart",
    },
    fr: {
      "milestone.context": "La tendance satellite décrit l’évolution de la végétation; elle ne vérifie pas les activités du projet. Une vérification terrain exige des relevés datés.",
      "milestone.public": "Preuve pour le site",
      "milestone.siteRecordTooltip": "Preuve publique à l’échelle du site; non vérifiée sur cette parcelle précise",
      "milestone.sourcesTitle": "Sources publiques examinées et limites",
      "milestone.siteScopeNotice": "Les rapports publics documentent la restauration d’Ebony Forest dans son ensemble. Ils ne vérifient pas les travaux dans ce polygone d’analyse.",
      "milestone.publisher": "Éditeur",
      "milestone.publicationDate": "Date de publication",
      "milestone.period": "Période d’activité",
      "milestone.reviewedOn": "Source consultée le",
      "milestone.evidenceType": "Type de preuve",
      "milestone.site": "Site",
      "milestone.coordinates": "Coordonnées (lat, lon)",
      "milestone.coordinatePrecision": "Précision de localisation",
      "milestone.notSpecified": "Non précisée",
      "milestone.scope": "Portée de la preuve",
      "milestone.claim": "Éléments documentés",
      "milestone.method": "Méthode de vérification de la source",
      "milestone.limitation": "Limite",
      "milestone.license": "Réutilisation",
      "milestone.scope.site": "Donnée à l’échelle du site",
      "milestone.scope.organization_method": "Méthode de l’organisation, pas un relevé d’activité",
      "milestone.scope.site_visit": "Visite du site, sans localisation de parcelle",
      "milestone.scope.geotagged_observation": "Observation géolocalisée, pas une preuve de restauration",
      "milestone.scope.candidate_observations": "Sources candidates, à vérifier une par une",
      "milestone.scope.species_management_context": "Contexte de gestion d’espèces uniquement",
      "milestone.type.environmental_impact_report": "Rapport d’impact environnemental",
      "milestone.type.grant_final_report": "Rapport final de subvention",
      "milestone.type.ngo_annual_report": "Rapport annuel d’ONG",
      "milestone.type.organization_methodology": "Méthodologie de l’organisation",
      "milestone.type.independent_visit_report": "Rapport de visite indépendant",
      "milestone.type.dated_geotagged_biodiversity_photo": "Photo de biodiversité datée et géolocalisée",
      "milestone.type.community_observation_index": "Index d’observations communautaires",
      "milestone.type.peer_reviewed_scientific_article": "Article scientifique évalué par les pairs",
      "milestone.type.partner_organization_summary": "Résumé d’une organisation partenaire",
      "milestone.satelliteMonitoring": "Suivi de la végétation par satellite",
      "milestone.monitoringSummary": "{count} observations Landsat 8 valides ({first}–{last}); tendance NDVI : {trend} (p de Mann–Kendall = {pValue}).",
      "milestone.verified": "Vérifié à partir des preuves indiquées",
      "milestone.notVerified": "Aucun enregistrement de vérification",
      "milestone.viewChart": "Voir le graphique",
    },
    mg: {
      "milestone.context": "Maneho ny fiovan’ny zavamaniry ny fironana avy amin’ny zanabolana, fa tsy manamarina ny asa tsirairay. Mila rakitra voatondro daty ny fanamarinana eny an-toerana.",
      "milestone.public": "Firaketana momba ny toerana",
      "milestone.siteRecordTooltip": "Tatitra momba ny toerana manontolo; tsy voamarina amin’ity saha ity",
      "milestone.sourcesTitle": "Loharano misokatra nodinihina sy ny fetrany",
      "milestone.siteScopeNotice": "Ny tatitra ampahibemaso dia miresaka ny famerenana amin’ny laoniny an’i Ebony Forest manontolo. Tsy manamarina asa ao anatin’ity faritra voasaritra ity izy ireo.",
      "milestone.publisher": "Mpamoaka",
      "milestone.publicationDate": "Daty namoahana",
      "milestone.period": "Fe-potoanan’ny asa",
      "milestone.reviewedOn": "Daty nijerena ny loharano",
      "milestone.evidenceType": "Karazana porofo",
      "milestone.site": "Toerana",
      "milestone.coordinates": "Toerana (lat, lon)",
      "milestone.coordinatePrecision": "Hamarinan’ny toerana",
      "milestone.notSpecified": "Tsy voalaza",
      "milestone.scope": "Velaran’ny porofo",
      "milestone.claim": "Izay voarakitra",
      "milestone.method": "Fomba nanamarinana ny loharano",
      "milestone.limitation": "Fetra",
      "milestone.license": "Fampiasana indray",
      "milestone.scope.site": "Firaketana momba ny toerana manontolo",
      "milestone.scope.organization_method": "Fomba fiasan’ny fikambanana, fa tsy firaketana asa",
      "milestone.scope.site_visit": "Fitsidihana toerana, tsy misy toerana marina amin’ny saha",
      "milestone.scope.geotagged_observation": "Fijerena misy toerana, tsy porofon’ny famerenana ala",
      "milestone.scope.candidate_observations": "Rakitra mety ilaina; diniho tsirairay",
      "milestone.scope.species_management_context": "Momba ny fitantanana karazana ihany",
      "milestone.type.environmental_impact_report": "Tatitra momba ny fiantraikany amin’ny tontolo iainana",
      "milestone.type.grant_final_report": "Tatitra faran’ny famatsiam-bola",
      "milestone.type.ngo_annual_report": "Tatitra isan-taonan’ny fikambanana tsy miankina",
      "milestone.type.organization_methodology": "Fomba fiasan’ny fikambanana",
      "milestone.type.independent_visit_report": "Tatitra fitsidihana tsy miankina",
      "milestone.type.dated_geotagged_biodiversity_photo": "Sary zavamananaina misy daty sy toerana",
      "milestone.type.community_observation_index": "Lisitra fijerena avy amin’ny vondrom-piarahamonina",
      "milestone.type.peer_reviewed_scientific_article": "Lahatsoratra siantifika nodinihin’ny manam-pahaizana",
      "milestone.type.partner_organization_summary": "Famintinana avy amin’ny fikambanana mpiara-miasa",
      "milestone.satelliteMonitoring": "Fanaraha-maso ny zavamaniry amin’ny zanabolana",
      "milestone.monitoringSummary": "Fandinihana Landsat 8 {count} manan-kery ({first}–{last}); fironana NDVI: {trend} (p Mann–Kendall = {pValue}).",
      "milestone.verified": "Voamarina tamin’ny porofo voatanisa",
      "milestone.notVerified": "Tsy misy rakitra fanamarinana",
      "milestone.viewChart": "Jereo ny sary an-tsary",
    },
    ig: {
      "milestone.context": "Mgbanwe ahịhịa site na satịlaịtị anaghị egosi na emere ọrụ a. Nkwenye n’ala chọrọ ndekọ nwere ụbọchị.",
      "milestone.public": "Ndekọ gbasara ebe ahụ",
      "milestone.siteRecordTooltip": "Ihe ndekọ gbasara ebe ahụ dum; ekwenyeghị maka plot a kpọmkwem",
      "milestone.sourcesTitle": "Isi mmalite ọha nyochara na oke ha",
      "milestone.siteScopeNotice": "Akụkọ ọha na-akọ maka mweghachi ọhịa Ebony Forest n’ozuzu ya. Ha anaghị akwado ọrụ n’ime polygon nyocha a.",
      "milestone.publisher": "Onye bipụtara ya",
      "milestone.publicationDate": "Ụbọchị e bipụtara ya",
      "milestone.period": "Oge ọrụ",
      "milestone.reviewedOn": "Ụbọchị e nyochara isi mmalite",
      "milestone.evidenceType": "Ụdị ihe akaebe",
      "milestone.site": "Ebe",
      "milestone.coordinates": "Nhazi ọnọdụ (lat, lon)",
      "milestone.coordinatePrecision": "Izi ezi ọnọdụ",
      "milestone.notSpecified": "Ekwughị ya",
      "milestone.scope": "Oke ihe akaebe",
      "milestone.claim": "Ihe ọ na-edekọ",
      "milestone.method": "Usoro nyocha isi mmalite",
      "milestone.limitation": "Oke ya",
      "milestone.license": "Iji ya ọzọ",
      "milestone.scope.site": "Ndekọ gbasara ebe ahụ dum",
      "milestone.scope.organization_method": "Ụzọ ọrụ otu; ọ bụghị ndekọ ọrụ mere",
      "milestone.scope.site_visit": "Nleta ebe ahụ; enweghị ọnọdụ kpọmkwem nke plot",
      "milestone.scope.geotagged_observation": "Nlele nwere ọnọdụ; ọ bụghị ihe akaebe mweghachi",
      "milestone.scope.candidate_observations": "Ndekọ nwere ike ịdị mkpa; nyochaa nke ọ bụla",
      "milestone.scope.species_management_context": "Ozi gbasara njikwa ụdị anụmanụ/osisi naanị",
      "milestone.type.environmental_impact_report": "Akụkọ mmetụta gburugburu ebe obibi",
      "milestone.type.grant_final_report": "Akụkọ mmechi onyinye ego",
      "milestone.type.ngo_annual_report": "Akụkọ afọ otu NGO",
      "milestone.type.organization_methodology": "Usoro ọrụ otu",
      "milestone.type.independent_visit_report": "Akụkọ nleta onwe ya",
      "milestone.type.dated_geotagged_biodiversity_photo": "Foto ihe dị ndụ nwere ụbọchị na ọnọdụ",
      "milestone.type.community_observation_index": "Ndepụta nlele ọha",
      "milestone.type.peer_reviewed_scientific_article": "Edemede sayensị ndị ọkachamara nyochara",
      "milestone.type.partner_organization_summary": "Nchịkọta otu mmekọ",
      "milestone.satelliteMonitoring": "Nlekota ahịhịa site na satịlaịtị",
      "milestone.monitoringSummary": "Nlele Landsat 8 {count} dị mma ({first}–{last}); mgbanwe NDVI: {trend} (p Mann–Kendall = {pValue}).",
      "milestone.verified": "Ekwenyere site na ihe akaebe egosiri",
      "milestone.notVerified": "Enweghị ndekọ nkwenye",
      "milestone.viewChart": "Lee eserese",
    },
  };
  Object.entries(milestoneUiTranslations).forEach(([language, entries]) => Object.assign(translations[language], entries));

  const interpolate = (text, values = {}) => text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
  let current = "en";
  try { current = localStorage.getItem("planetcred-language") || "en"; } catch (_) { /* storage may be disabled */ }
  if (!translations[current]) current = "en";

  function t(key, values) {
    return interpolate(translations[current][key] || translations.en[key] || key, values);
  }

  function applyLanguage(language) {
    if (!translations[language]) return;
    current = language;
    try { localStorage.setItem("planetcred-language", language); } catch (_) { /* storage may be disabled */ }
    document.documentElement.lang = language === "mg" ? "mg" : language === "ig" ? "ig-NG" : language;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      const translated = t(element.dataset.i18nTitle);
      if (element.tagName === "TITLE") element.textContent = translated;
      else element.title = translated;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });
    const currentLabel = document.getElementById("language-current");
    if (currentLabel) currentLabel.innerHTML = `<img src="${languages[current].flag}" alt="" class="h-4 w-5 rounded-sm object-cover"><span>${languages[current].name}</span>`;
    const toggle = document.getElementById("language-toggle");
    const menuElement = document.getElementById("language-options");
    if (toggle) toggle.setAttribute("aria-label", t("nav.language"));
    if (menuElement) menuElement.setAttribute("aria-label", t("nav.language"));
    if (menuElement) menuElement.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === current));
    });
    document.dispatchEvent(new CustomEvent("app-language-changed", { detail: { language: current } }));
  }

  function addLanguageControl() {
    const header = document.querySelector("header");
    if (!header || document.getElementById("language-control")) return;
    const wrapper = document.createElement("div");
    wrapper.id = "language-control";
    const actions = document.getElementById("header-actions");
    wrapper.className = actions ? "relative shrink-0 text-sm" : "relative ml-auto shrink-0 text-sm";
    wrapper.innerHTML = `
      <button id="language-toggle" type="button" class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white hover:border-emerald-500" aria-haspopup="true" aria-expanded="false" aria-label="${t("nav.language")}">
        <span id="language-current" class="inline-flex items-center gap-2"><img src="${languages[current].flag}" alt="" class="h-4 w-5 rounded-sm object-cover"><span>${languages[current].name}</span></span><span aria-hidden="true" class="ml-2 text-slate-400">▾</span>
      </button>
      <div id="language-options" class="absolute right-0 z-[1000] mt-2 hidden min-w-48 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl" role="menu" aria-label="${t("nav.language")}">
        ${Object.entries(languages).map(([code, language]) => `<button type="button" role="menuitemradio" data-language="${code}" aria-pressed="${code === current}" class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"><img src="${language.flag}" alt="" class="h-4 w-5 rounded-sm object-cover"><span>${language.name}</span></button>`).join("")}
      </div>`;
    (actions || header).appendChild(wrapper);
    const toggle = wrapper.querySelector("#language-toggle");
    const options = wrapper.querySelector("#language-options");
    toggle.addEventListener("click", () => {
      const open = options.classList.toggle("hidden");
      toggle.setAttribute("aria-expanded", String(!open));
    });
    options.addEventListener("click", (event) => {
      const button = event.target.closest("[data-language]");
      if (!button) return;
      applyLanguage(button.dataset.language);
      options.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    });
    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) {
        options.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  window.t = t;
  window.getAppLanguage = () => current;
  addLanguageControl();
  applyLanguage(current);
})();
