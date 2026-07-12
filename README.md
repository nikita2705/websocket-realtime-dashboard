# Real-time Data Stream (WebSocket Monitor)

## Projekta palaišanas un instalācijas instrukcija

### Serveris (Backend)
1. Atver termināli un dodies uz `server` mapi.
2. Instalē atkarības: `npm install`
3. Palaid serveri: `npm start` vai `node server.js`. Serveris darbosies uz portu 3000.

### Klients (Frontend)
1. Atver jaunu termināļa logu un dodies uz `client` mapi.
2. Instalē atkarības: `npm install`
3. **Vides mainīgie (Environment variables):** Klienta saknes mapē izveido `.env` failu pēc `.env.example` parauga. (Ja fails netiks izveidots, sistēma automātiski izmantos noklusējuma localhost adreses).
4. Palaid Vue saskarni: `npm run dev`

---

## Informācija par izpildītajiem uzdevumiem

### Pamata uzdevums
* Node.js serveris ģenerē nejaušu skaitli (0-100) reizi 10 sekundēs. - **Izpildīts**
* Skaitļa svārstības ir robežās ±30% no iepriekš ģenerētā skaitļa. - **Izpildīts**
* Vērtība un laiks tiek publiskoti saskarnei, izmantojot WebSocket ziņojumus. - **Izpildīts**
* Vue.js saskarne saņem datus no WebSocket un saglabā tos kā datu punktus. - **Izpildīts**
* Dati tiek reaktīvi atrādīti līniju tipa grafikā (ApexCharts). - **Izpildīts**
* Grafika X-ass attēlo datuma un laika vērtības, Y-ass- saņemto skaitli. - **Izpildīts**
* Grafikā tiek uzturēti maksimums 15 datu punkti. - **Izpildīts**

### Papilduzdevums - Datu atjaunošanas mehānisms
* Izstrādāts process, kurš izveido datu punktu failu (`history.json`), ja tāda nav. - **Izpildīts**
* Pēc servera restarta tiek ielasīts pēdējais datu punkts vēstures turpināšanai. - **Izpildīts**
* Fails tiek automātiski papildināts ar jaunu ģenerēto datu punktu. - **Izpildīts**
* Izstrādāts HTTP webserviss vēsturisko datu ielādei saskarnē. - **Izpildīts**
* Uzlabots grafiks, lai tajā sākotnēji rādītos arī vēsturiski ģenerētie datu punkti. - **Izpildīts**
* Pievienots teksta elements ar laiku, kad pēdējo reizi tika atjaunoti dati. - **Izpildīts**
* Pievienots reaktīvs teksta elements/indikators par aktīvu WebSocket pieslēgumu (Connected/Disconnected). - **Izpildīts**
* Izstrādāts automātiskas atkārtotas pieslēgšanās mehānisms servera darbības atjaunošanas gadījumā. - **Izpildīts**

### Papildpunkti un Koda kvalitāte
* Saskarņu izveidei izmantots NaiveUI ietvars (kartītes, tagi, ielādes indikatori). - **Izpildīts**
* Koda analīzei izmantots ESLint (ar `eslint-config-airbnb` formatējumu). - **Izpildīts**

## Informācija par izmantotiem MI rīkiem

Projekta izstrādes gaitā kā asistējošais rīks tika izmantots Google Gemini.

* **Koda kvalitāte un vides konfigurācija:** Palīdzība ar ESLint (`eslint-config-airbnb`) noteikumu ieviešanu un konfigurēšanu.
* **Frontend izstrāde:** MI tika izmantots lielākai daļai frontend koda ģenerēšanas. Tas iekļauj reāllaika datu piesaisti `ApexCharts` grafikam un saskarnes vizuālo elementu strukturēšanu ar `Naive UI`.
* **Backend koda pārskatīšana.** MI pārskatīja kodu, deva ieteikumus lasāmības un struktūras uzlabošanai.
* **Informācijas meklēšana:** Izmantots lai paātrinātu atbilstošās oficiālās dokumentācijas un sintakses piemēru atrašanu.
