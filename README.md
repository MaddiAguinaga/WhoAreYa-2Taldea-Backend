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

## Karpeta antolaketa 
#### Hautatutako aukera: Egitura hibridoa (C aukera)
Karpeta-antolaketarako egitura hibridoa hautatu da, motaren araberako karpeten eta domeinuaren araberako banaketaren arteko oreka egokia eskaintzen duelako. Alde batetik, elementu orokorrak (`models`, `config`, `middlewares`) leku bakarrean zentralizatzea ahalbidetzen du, eta bestetik, domeinu bakoitzaren logika modu isolatuan antolatzea errazten du, egitura soilik motaren araberakoa edo soilik domeinuaren araberakoa erabiltzeak sor ditzakeen mugak saihestuz. Horri esker, APIaren logika argi bereizten da eta administrazio-panelaren integrazioa modu eraginkorrean planifika daiteke.

Honako hau da karpeta-zuhaitza: 
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
        └──League.js
        └──Team.js
        └──Player.js
        └──User.js
    ├── controllers/ 
        └──auth.controller.js
        └──players.controller.js
        └──teams.controller.js
        └──leagues.controller.js
    ├── routes/ 
        └── api/ 
            └── auth.routes.js
            └── players.routes.js
            └── teams.routes.js
            └── leagues.routes.js
        └── admin.routes.js          
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
Aplikazioaren ibilbide nagusiak dagoeneko inplementatuta daude, APIaren egitura argi eta koherente bat eskainiz. Ibilbide hauek proiektuaren egungo egoera islatzen dute, eta REST arkitekturaren printzipioak jarraituz antolatu dira. Hiru maila nagusi bereizten dira: /api/* API RESTerako, JSON bidezko komunikazioa erabiliz; /admin/* administrazio-panelerako, admin rola duten erabiltzaileentzat soilik eskuragarria; eta /, jokoaren atal publikorako. Egitura honek aplikazioaren funtzionaltasun nagusiak bereiztea ahalbidetzen du, segurtasuna eta mantentze-lanak erraztuz.
Une honetan, honako ibilbideak daude erabilgarri:

| Metodoa | Endpoint                  | Deskribapena                                                                                                                    | Baimena        |
|---------|---------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------------|
| GET     | /                         | Jokoaren hasierako orria                                                                                                        | Publikoa       |                                                                                                                                                 |          |
| GET     | /api/players              | Jokalarien zerrenda lortzea (Query params gabe auto-osaketarako. Query params-en page eta limit badaude orrialde-banaketa egin) | Publikoa       |
| GET     | /api/players/:id          | IDaren araberako jokalari baten informazioa lortzea                                                                             | Publikoa       |
| GET     | /api/teams                | Talde guztiak lortu                                                                                                             | Publikoa       |
| GET     | /api/leagues              | Liga guztiak lortu                                                                                                              | Publikoa       |
| GET     | /api/solution/:gameNumber | Eguneko jokalaria lortu                                                                                                         | Publikoa       |
| POST    | /api/auth/login           | Erabiltzailearen saioa hastea (curl bidez egin behar da)                                                                        | Publikoa       |
| POST    | /api/auth/register        | Erabiltzaile berria sortzea  (curl bidez egin behar da)                                                                         | Publikoa       |
| GET     | /admin                    | Jokalari guztien zerrenda erakutsi (Erabiltzailea autentifikatua badago eta Admin rola badu)                                    | Admin          |
| GET     | /admin/login              | Admin erabiltzaileak sartzeko formularioa erakutsi                                                                              | Publikoa       |
| POST    | /admin/login              | Admin erabiltzaileak sartzeko formularioaren datuak jaso                                                                        | Publikoa       |
| GET     | /admin/players/new        | Jokalari berri bat sortzeko formularioa                                                                                         | Admin          |
| POST    | /admin/players/new        | Jokalari berri bat sortzen du                                                                                                   | Admin          |
| GET     | /admin/players/edit/:id   | Jokalaria editatzeko formularioa erakutsi                                                                                       | Admin          |
| PUT     | /admin/players/edit/:id   | Jokalari baten datu guztiak eguneratzea                                                                                         | Admin          |
| DELETE  | /admin/players/delete/:id | Jokalari bat ezabatzen du "Delete" botoia sakatuz                                                                               | Admin          |

### Milestone 5-ren  erabakia: Ikuspegi tradizionala jarraitu
Milestone honetarako ikuspegi tradizionala hautatu da. Ikuspegi honetan, Express zerbitzaria HTML formularioen eta REST APIaren arteko bitartekari gisa erabiltzen da, EJS txantiloiak erabiliz interfazea sortzeko. Ikuspegi hau aukeratu da sinplea, ulerterraza eta koherentea delako, eta gainera aurreko erabakiekin bat datorrelako. Metodo tradizionalak datuen fluxu argia eskaintzen du: erabiltzaileak ekintza bat egiten du interfazetik, Express-ek eskaera jasotzen du eta ondoren REST APIari delegatzen dio eragiketa, honek balidazioa eta datu-basearekiko interakzioa kudeatuz.

### Test automatikoak
Test automatikoak garatu dira sistemako funtzionalitate desberdinak behar bezala funtzionatzen dutela ziurtatzeko. Horien bidez, bai barne-logikaren zuzentasuna egiaztatu da, bai APIarekiko konexioa eta CRUD eragiketetarako baimenak behar bezala kudeatzen direla bermatu da.
