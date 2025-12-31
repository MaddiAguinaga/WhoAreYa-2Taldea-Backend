# WhoAreYa - Arkitekturaren diseinua 

## Hasieraketa
Proiektuaren hasieraketa, behin dependentzia guztiak instalatuta daudela, hurrengo komandoaren bidez egingo da: `npm start`

## Milestone 0: erabakiak
Milestone 0-ren helburua **Who Are Ya?** aplikazioaren backend-aren arkitektura definitzea da, inplementazioa hasi aurretik erabaki nagusiak argi uzteko eta ondorengo mugarriak modu koherentean garatu ahal izateko.

## Proiektuaren egitura

#### Hautatutako aukera: Egitura modularra (B aukera)
Egitura modularra aukeratu da Express Generator-ek eskaintzen duen egitura tradizionalarekin alderatuta kodearen antolaketa argiagoa, eskalagarriagoa eta mantengarriagoa eskaintzen duelako. Backend-a `src/` direktorioaren barruan antolatzeak ardura banaketa egokia bermatzen du, eta horrek funtzionalitate berriak pixkanaka gehitzea eta moduluak modu independentean garatzea ahalbidetzen du. Gainera, egitura honek taldeko lana paraleloan egitea errazten du eta egungo backend modernoetan erabiltzen diren antolaketa-patroiekin bat dator, autentifikazioa, middlewareak eta CRUD eragiketak modu ordenatuan inplementatzeko egokia izanik.

## Zerbitzariaren sarrera-puntua
#### Hautatutako aukera: server.js (B aukera)
Zerbitzariaren sarrera-puntu gisa `server.js` hautatu da, aplikazioaren konfigurazioa (`app.js`) eta zerbitzariaren abiaraztea modu argian bereiztea ahalbidetzen duelako, baina fitxategi kopuru gehiegirik sortu gabe. Aukera hau egokiagoa da konfigurazioa eta exekuzioa fitxategi berean bateratzen dituen aukera baino, azken horrek kodearen hazkundea eta testagarritasuna zailtzen baititu. Gainera, `bin/www` bezalako egitura tradizionalek baino sinpleagoa eta ulergarriagoa egiten da, batez ere proiektuaren hasierako faseetan.

## Karpeta antolaketa (Eguneratuta Milestone 1-ren ondoren)
#### Hautatutako aukera: Egitura hibridoa (C aukera)
Karpeta-antolaketarako egitura hibridoa hautatu da, motaren araberako karpeten eta domeinuaren araberako banaketaren arteko oreka egokia eskaintzen duelako. Alde batetik, elementu orokorrak (`models`, `config`, `middlewares`) leku bakarrean zentralizatzea ahalbidetzen du, eta bestetik, domeinu bakoitzaren logika modu isolatuan antolatzea errazten du, egitura soilik motaren araberakoa edo soilik domeinuaren araberakoa erabiltzeak sor ditzakeen mugak saihestuz. Horri esker, APIaren logika argi bereizten da eta administrazio-panelaren integrazioa modu eraginkorrean planifika daiteke.

Honako hau da Milestone 1 egin ondoren lortzen den karpeta-zuhaitza: 
```
WhoAreYa-2Taldea-Backend/
└── scripts/
    └── downloadAllImages.js
    └── fetchFlags.js
    └── fetchLeagues.js
    └── fetchTeamsLogos.js
    └── seed.js
    
└── src/
    ├── app.js
    ├── server.js 
    ├── config/ 
    ├── models/ 
    ├── controllers/ 
    ├── routes/ 
    ├── middlewares/ 
    ├── public/ 
        └── images/
        └── js/
        └── json/
        └── txt/
        └── index.html    
    └── views/ 
```

`/src/services` karpeta ezabatu da eta horren ordez proiektuaren erroan kokatu den `/script` karpeta sortu da, aplikazioaren logikatik kanpo dauden script erabilgarriak gordetzeko. `src/` karpetan aplikazioaren kode-oinarria dago, eta bertan daude konfigurazioak, modeloak, kontrolatzaileak, ibilbideak, middlewareak, fitxategi publikoak eta ikuspegiak.
## Konfigurazioaren kudeaketa
#### Hautatutako aukera: Konfigurazio zentralizatua (B aukera)
Konfigurazio zentralizatua hautatu da, ingurune-aldagaiak `.env` fitxategitik kargatu eta `src/config/index.js` fitxategian bateratzeko aukera ematen duelako, `process.env` aldagaien erabilera sakabanatuak sor ditzakeen arazoak saihestuz. Estrategia honek segurtasuna hobetzen du, konfigurazio sentikorra kode nagusitik bereizten duelako, eta hainbat ingurune (garapena, ekoizpena eta testak) modu erraz eta koherentean kudeatzeko aukera ematen duelako, aldagaiak baliozkotuz eta lehenetsitako balioak definituz.

## Sistemaren ibilbideak
Aplikazioaren ibilbide nagusiak aurrez definitu dira, programazioa hasi aurretik APIaren egitura orokorra argi uzteko eta lan-talde osoak ikuspegi komun bat izan dezan. Hasierako plangintzan hiru maila nagusi bereizten dira: `/api/*` API RESTerako, JSON bidezko komunikazioa erabiliz; `/admin/*` administrazio-panelerako, admin rola behar duena; eta `/`, jokoaren atal publikorako. Plangintza orokor honek malgutasuna mantentzen du, endpoint zehatzak hurrengo mugarrietan definitu eta inplementatzeko aukera emanez.
Orain arte honako ibilbideak aurreikusten dira: 

| Mota | Metodoa | Endpoint            | Deskribapena                         | Baimena |
|-----|---------|---------------------|--------------------------------------|---------|
| API | GET     | /api/players        | Jokalarien zerrenda lortzea           | Publikoa |
| API | POST    | /api/auth/login     | Erabiltzailearen saioa hastea         | Publikoa |
| API | POST    | /api/auth/register  | Erabiltzaile berria sortzea           | Publikoa |
| WEB | GET     | /admin              | Administrazio-panela                  | Admin |
| WEB | GET     | /                   | Jokoaren hasierako orria              | Publikoa |





Hartutako erabakiek proiektuaren hurrengo mugarriak modu egituratuan garatzeko oinarri sendoa ezartzen dute.

