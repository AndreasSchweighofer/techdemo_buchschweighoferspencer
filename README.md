# README: Techdemo "Automated Docker deployments to Dockerhub with Github Actions"

**authors:** Buch, Schweighofer und Spencer

## Einführung und Grundlagen

### Verständnis von Continuous Delivery und dessen Bedeutung

Continuous Delivery ist eine Softwareentwicklungspraxis, bei der Software in Intervallen automatisch und zuverlässig bereitgestellt wird. Ziel ist es, den Entwicklungsprozess automatisiert und effizienter zu gestalten. Es ermöglicht viele vorteilhafte Funktionen wie z.B. eine kontinuierliche Integration von Codeänderungen, automatisierte Tests und eine Bereitstellung in Produktionsumgebungen. So kann man im Team effizienter zusammenarbeiten.

In unserem Projekt werden zentrale Bestandteile von Continous Delivery umgesetzt. 
**TODO** Continue mit schwaffel

### Unterschiede zwischen Continuous Integration, Continuous Delivery und Continuous Deployment

- Continuous Integration: Automatisiert die Integration von Codeänderungen im Entwicklungsprozess, um Probleme früh zu erkennen.
- Continuous Delivery: Automatisiert den Prozess der Softwarebereitstellung von getesteten Code bis zur Produktionsumgebung, wodurch Software jederzeit auslieferbar ist.
- Continuous Deployment: Erweitert Continuous Delivery, indem automatisch jede fehlerfreie Codeintegration in die Produktionsumgebung bereitgestellt wird.

**TODO** irgendwas projektbezogenes schreiben

### CI-Anti Pattern identifizieren

Basierend auf den bereitgestellten Dateien und Informationen lassen sich keine spezifischen Continuous Integration (CI) Anti-Patterns direkt identifizieren. Allerdings kann ich einige allgemeine CI Anti-Patterns erläutern, die in Projekten oft vorkommen:

Late Integration: Verzögerung bei der Integration von Änderungen in den Haupt-Branch. Dies führt zu Integrationsproblemen und erschwert das Finden und Beheben von Fehlern.

Übermäßige oder Lange Build-Zeiten: Wenn der CI-Prozess sehr lange dauert, kann dies die Produktivität des Teams beeinträchtigen, da Entwickler auf den Abschluss der Builds warten müssen.

Fehlendes oder Unzureichendes Testing: CI-Pipelines sollten automatisierte Tests enthalten, um sicherzustellen, dass Änderungen keine bestehenden Funktionen beeinträchtigen. Fehlende oder unzureichende Tests sind ein häufiges Anti-Pattern.

Ignoring Broken Builds: Das Ignorieren von fehlerhaften Builds oder das Verschieben ihrer Korrektur kann zu einer Akkumulation von Problemen führen, die schwieriger zu beheben sind.

Fehlendes oder Unklare Feedback: Wenn der CI-Prozess nicht klar kommuniziert, welche Probleme aufgetreten sind, wird es für Entwickler schwierig, Fehler zu diagnostizieren und zu beheben.

Abhängigkeit von Manuellen Schritten: Wenn der CI-Prozess manuelle Eingriffe erfordert, wird der Hauptvorteil der Automatisierung untergraben.

Nicht Wiederholbare Builds: Wenn Builds nicht konsistent sind und von der Umgebung abhängen, in der sie ausgeführt werden, kann dies zu "funktioniert auf meinem Rechner" Problemen führen.

Mangelnde Dokumentation: Unzureichende Dokumentation des CI-Prozesses kann zu Verwirrung und Fehlern führen, insbesondere in Teams mit mehreren Entwicklern.

## Deployment-Strategien

**Containerbasiertes Deployment**

Unsere Anwendung ist für ein containerbasiertes Deployment konzipiert, wie durch das Vorhandensein eines Dockerfile angezeigt wird. Dies bedeutet, dass die Anwendung in Docker-Containern verpackt wird, wodurch sie in verschiedenen Umgebungen konsistent ausgeführt werden kann. Die Containerisierung erleichtert das Deployment und die Skalierung der Anwendung auf Container.

Continuous Deployment (CD)
Durch die Integration von Git Actions in unseren Entwicklungsprozess haben wir eine Continuous Deployment (CD)-Pipeline implementiert. Diese Pipeline automatisiert den Prozess des Deployments, indem sie den Code direkt aus unserem Repository in die Produktionsumgebung überträgt, sobald die Continuous Integration (CI)-Tests erfolgreich abgeschlossen sind.

## Projektdokumentation

### Ausgangsapplikation

Als Beispielapplikation haben wir eine Node-Anwendung erstellt, die ganz einfach Hello World auf http://localhost:4000 ausgibt.

![screenshot1](/resources/img/screen1.png)

![screenshot2](/resources/img/screen2.png)

### Einrichten eines Docker Images

Um die Applikation in einem Docker Container laufen zu lassen, muss zunächst ein Docker Image initialisiert werden. Dazu sind einige Schritte notwendig:

1. Erstellen eines Dockerfiles
   
![screenshot3](/resources/img/screen3.png)

Was jede Zeile im Dockerfile tut:

**FROM node:19**:
Diese Zeile legt das Basis-Image fest, von dem dein Image erstellt wird. Hier wird das offizielle Node.js-Image verwendet, spezifisch die Version 19. Dieses Image beinhaltet die Node.js-Laufzeitumgebung und alles, was notwendig ist, um Node.js-Anwendungen auszuführen.

**WORKDIR /usr/src/app**:
    Setzt das Arbeitsverzeichnis im Container. Alle folgenden Anweisungen werden relativ zu diesem Verzeichnis ausgeführt. /usr/src/app ist ein üblicher Ort, um den Anwendungscode in einem Container zu platzieren.

**COPY package*.json ./**:
    Kopiert package.json und (falls vorhanden) package-lock.json oder npm-shrinkwrap.json in das Arbeitsverzeichnis des Containers. Diese Dateien definieren die Abhängigkeiten deiner Node.js-Anwendung.

**RUN npm install**:
    Führt den Befehl npm install aus, der die in package.json (und package-lock.json) definierten Abhängigkeiten installiert. Diese Abhängigkeiten werden im lokalen node_modules-Verzeichnis des Containers gespeichert.

**COPY . .**:
    Kopiert alle Dateien aus deinem Projektverzeichnis (außer denen, die in der .dockerignore-Datei ausgeschlossen sind) in das Arbeitsverzeichnis des Containers. Dazu gehören deine Anwendungscode-Dateien, Konfigurationsdateien, statische Assets etc.

**EXPOSE 4000**:
    Informiert Docker, dass der Container auf Port 4000 lauscht. Dies ist der Port, auf dem deine Node.js-Anwendung wahrscheinlich läuft. Beachte, dass diese Anweisung den Port nicht tatsächlich öffnet, sie dient eher als Dokumentation.

**CMD ["npm", "run", "start", "test"]**:

Legt den Standardbefehl fest, der ausgeführt wird, wenn der Container gestartet wird. In diesem Fall scheint es ein Missverständnis zu sein, da "npm", "run", "start", "test" nicht wie beabsichtigt funktionieren wird. Normalerweise sieht man etwas wie CMD ["npm", "start"], um die Anwendung zu starten.

Die Verwendung von npm run start test ist ungewöhnlich und könnte ein Fehler sein. Wenn start und test separate Skripte in deiner package.json sind, solltest du dich für eines entscheiden, das beim Start des Containers ausgeführt werden soll.

2. Builden des Docker image

![screenshot4](/resources/img/screen4.png)

3. Starten der Applikation zum testen im Docker Container

![screenshot5](/resources/img/screen5.png)

App wird dabei im Dockerfile angegebenen Pfad angelegt:

![screenshot6](/resources/img/screen6.png)

### Einrichten eines Repos auf Github

Um eine adäquate Versionskontrolle zu gewährleisten wurde ein zentrales Github Repository angelegt. Darauf wird im Sinne der Continous Integration das Projekt weiterentwickelt und Github Actions verwendet um eine CI/CD-Pipeline zu erstellen.

Link zum Repo: https://github.com/hallotechdemo/techdemo_buchschweighoferspencer.git

Zusätzlich muss ein passendes .gitignore erstellt werden damit keine gerätespezifischen Dateien im Repo abgelegt werden (z.B. Ordner "node_modules").

![screenshot8](/resources/img/screen8.png)

### Einrichten von Dockerhub und anlegen von Secrets in Github

Um das Docker Image nun automatisiert auf Dockerhub zu deployen wird zunächst ein Dockerhub Account angelegt und ein Repository eingerichtet. 

Die GitHub-Action, die wir einrichten wollen wird das Docker-Image im DockerHub-Repository veröffentlichen. Daher muss Github das richtige Zugriffstoken besitzen sowie den Benutzernamen von Dockerhub.

Dazu muss zunächst ein Access Token in Dockerhub angelegt werden (über Security und Create Access Token):

![screenshot7](/resources/img/screen7.png)

Dieses Token (sowie der Benutzername von Dockerhub) soll nun in Github als Secret hinterlegt werden damit die Github-Action dann darauf zugreifen kann. Unter Settings -> Secrets and variables befindet sich die Einstellung, um neue Secrets anzulegen.

![screenshot9](/resources/img/screen9.png)
![screenshot10](/resources/img/screen10.png)

### GitHub Actions

Github Actions fungiert als Pipeline um das Docker image zu builden und auf DockerHub zu deployen. Dies passiert bei jeder Änderung des Codes im Main-Branch des Repositories.

Die Einstellungen um eine GitHub Action anzulegen befindet sich unter Actions -> set up a workflow.

Über diesen Button wird ein main.yml erstellt in der die Pipeline definiert wird.

### main.yml

![screenshot11](/resources/img/screen11.png)

In dieser GitHub Actions Workflow-Konfiguration werden mehrere Schritte ausgeführt, um automatisierte Aufgaben für ein Node.js-Projekt zu erledigen, jedes Mal, wenn Änderungen in den main-Branch gepusht werden. Hier ist eine zusammengefasste Erklärung der einzelnen Schritte:

Auslöser des Workflows: Der Workflow wird jedes Mal ausgelöst, wenn Änderungen (pushes) im main-Branch des GitHub-Repository gemacht werden.

Aufbau des Jobs: Der Job namens "Build Docker image" wird auf einem virtuellen Ubuntu-Server (neueste Version) ausgeführt.

Schritte des Jobs:

a. Checkout: Der aktuelle Code des Repository wird auf den virtuellen Server (Runner) kopiert.

b. Login to Docker Hub: Der Workflow meldet sich mit den bereitgestellten Geheimnissen (DOCKERHUB_USERNAME und DOCKERHUB_TOKEN) bei Docker Hub an. Diese Geheimnisse werden in den Einstellungen des GitHub-Repository gespeichert und sind für die Authentifizierung bei Docker Hub notwendig.

c. Set up Docker Buildx: Einrichten von Docker Buildx im Runner. Buildx ist ein erweiterter Docker Builder, der unter anderem das Bauen von Multi-Plattform-Images unterstützt.

d. Build and Push: Das Docker-Image wird gemäß den Anweisungen im Dockerfile gebaut. Nach erfolgreichem Build wird das Image zu Docker Hub gepusht, wobei das Tag des Images aus dem Docker Hub-Benutzernamen und dem Suffix /samandirob:latest besteht.

e. Run Tests: Nach dem Pushen des Images wird ein Docker-Container aus diesem Image gestartet und npm test darin ausgeführt. Dieser Schritt führt automatisierte Tests im Kontext des Docker-Containers aus.

### Testing

Ziel: Test der Haupt-Route einer Express.js-Anwendung.
Frameworks und Bibliotheken:
Mocha: Ein JavaScript-Test-Framework für Node.js-Programme.
Chai: Eine Assertion-Bibliothek für Node.js und den Browser.
Supertest: Eine Superagent-getriebene Bibliothek zum Testen von HTTP-Services.
Test-Setup
Express-Anwendung (app.js):

Eine einfache Express-Anwendung, die eine GET-Anfrage an der Wurzelroute ('/') behandelt und "Hello World!" zurückgibt.
Test-Datei (app.test.js):

Enthält den Test für die Express-Anwendung.
Verwendet Supertest, um HTTP-Anfragen an die Anwendung zu senden.
Verwendet Chai für Assertions.
Test-Szenario
GET-Anfrage an die Wurzelroute ('/'):
Erwartet, dass die Antwort den Statuscode 200 (OK) hat.
Erwartet, dass der Antworttext "Hello World!" ist.
