# CV Simple — Générateur de CV

Application web full-stack permettant de créer, éditer et gérer un CV de manière interactive. Le projet est composé d'un **backend Java (Spring Boot 3)** et d'un **frontend Angular 17** avec Angular Material, ainsi que d'une page **HTML/CSS statique** pour la visualisation et l'impression du CV.

---

## Architecture Générale

Le projet suit une architecture client-serveur classique. Le backend expose une API REST au port `8080` sous `/api/cv`, et le frontend Angular tourne par défaut sur `http://localhost:4200`. Les deux communicate via des requêtes HTTP JSON, avec une configuration CORS (`CorsConfig.java`) qui autorise explicitement l'origine du frontend Angular.

La communication suit un format de réponse standardisé : chaque réponse API est enveloppée dans un objet `ApiResponse<T>` contenant un champ `success` (boolean), un `message` optionnel, les `data`, et un `timestamp`. Cela permet au frontend de traiter les succès et erreurs de manière uniforme.

---

## Backend — Spring Boot 3.3.5 / Java 21

### Point d'entrée

L'application est lancée par `CvSimpleApplication.java`, une classe annotée `@SpringBootApplication` contenant simplement la méthode `main` qui appelle `SpringApplication.run()`. C'est le point de démarrage standard d'une application Spring Boot.

### Couche Entity (JPA)

Le cœur du modèle de données repose sur l'entité `CV.java` qui représente un curriculum vitae complet. Cette entité contient :

- **`PersonalInfo`** — un objet `@Embeddable` intégré directement dans la table `cvs`, contenant `fullName`, `jobTitle`, `location`, `email`, `linkedInUrl` et `photoUrl`. Les champs `fullName` et `jobTitle` sont optionnels à la création (permettant de créer un CV vide puis de le remplir via l'éditeur), et `email` est validé avec `@Email`.
- **`profileSummary`** — un texte libre stocké en `CLOB` pour le résumé du profil.
- **6 collections `@OneToMany`** avec `cascade = ALL` et `orphanRemoval = true` : `Certification`, `Skill`, `Experience`, `Project`, `Formation`, `Language`. Chaque sous-entité a sa propre table (ex: `certifications`, `skills`, `experiences`, `projects`, `formations`, `languages`) liée par une clé étrangère `cv_id`.
- Des timestamps `createdAt` et `updatedAt` gérés automatiquement par Hibernate (`@CreationTimestamp`, `@UpdateTimestamp`).

Chaque sous-entité possède un `id` auto-généré (`GenerationType.IDENTITY`), des champs obligatoires validés par `@NotBlank`, et certains champs texte stockés en `CLOB` pour les contenus de taille variable (descriptions, highlights, valeurs de compétences).

### Couche DTO

Pour chaque entité il existe un DTO correspondant (`CvDTO`, `PersonalInfoDTO`, `CertificationDTO`, `SkillDTO`, `ExperienceDTO`, `ProjectDTO`, `FormationDTO`, `LanguageDTO`). Les DTOs servent de couche de transfert entre le backend et le frontend, isolant le modèle JPA de la représentation API. Le DTO racine `CvDTO` contient toutes les sous-listes avec des `ArrayList` vides par défaut (via `@Builder.Default`). La validation Jakarta (`@Valid`) est appliquée aux DTOs dans les contrôleurs.

### Couche Mapper (MapStruct)

`CvMapper.java` est une interface annotée `@Mapper(componentModel = "spring")` qui définit les méthodes de conversion entre chaque entité et son DTO (`toDto` / `toEntity`). Elle inclut aussi des méthodes `default` pour la conversion de listes (ex: `certificationsToDto`, `skillsToEntity`, etc.), gérant les listes nulles en retournant des listes vides. MapStruct génère l'implémentation automatiquement (`CvMapperImpl.java` dans `target/generated-sources`).

### Couche Repository

`CvRepository.java` étend `JpaRepository<CV, Long>` et ne définit aucune méthode spécifique — elle hérite de toutes les opérations CRUD standard (findAll, findById, save, delete, etc.).

### Couche Service

`CvService.java` est l'interface définissant les 14 opérations métier. `CvServiceImpl.java` est l'implémentation annotée `@Service` et `@Transactional`. Elle contient :

- **CRUD principal** : `getCv` (lecture seule via `@Transactional(readOnly = true)`), `createCv`, `updateCv`, `deleteCv`.
- **Opérations sur sous-éléments** : `addCertification`/`removeCertification`, `addSkill`/`removeSkill`, `addExperience`/`removeExperience`, `addProject`/`removeProject`, `addFormation`/`removeFormation`, `addLanguage`/`removeLanguage`.

La méthode `updateCv` suit un pattern "clear and repopulate" : elle vide chaque collection existante (`clear()`) puis y ajoute les nouveaux éléments depuis le DTO. Les méthodes `remove*` utilisent `removeIf` avec comparaison d'ID et lèvent `ResourceNotFoundException` si l'élément n'est pas trouvé. Une méthode privée `findCvById` centralise la recherche avec gestion d'erreur.

### Couche Controller

`CvController.java` est un `@RestController` mappé sur `/api/cv`. Il expose :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/cv/{id}` | Récupérer un CV |
| POST | `/api/cv` | Créer un CV |
| PUT | `/api/cv/{id}` | Mettre à jour un CV |
| DELETE | `/api/cv/{id}` | Supprimer un CV |
| POST | `/api/cv/{cvId}/certifications` | Ajouter une certification |
| DELETE | `/api/cv/{cvId}/certifications/{certificationId}` | Supprimer une certification |
| POST/DELETE | ... | Idem pour skills, experiences, projects, formations, languages |

Chaque endpoint est documenté avec `@Operation(summary = "...")` pour Swagger/OpenAPI.

### Gestion des erreurs

`GlobalExceptionHandler.java` est un `@RestControllerAdvice` qui intercepte :
- `ResourceNotFoundException` → HTTP 404
- `BadRequestException` → HTTP 400
- `MethodArgumentNotValidException` → HTTP 400 avec la map des erreurs de champ
- `Exception` (générique) → HTTP 500

### Configuration

- **`application.yml`** : définit le profil actif (`dev`), le port `8080`, et la config Swagger (`/swagger-ui.html`, `/api-docs`).
- **Profil dev** : se connecte à une base Oracle locale (`localhost:1521/XE`) avec Hibernate dialect Oracle.
- **Profil test** : utilise une base H2 en mémoire avec `create-drop`, Swagger désactivé, et Flyway désactivé.
- **Flyway** est activé en production pour les migrations de schéma (`classpath:db/migration`, schéma `cv_simple`).

### Dépendances principales (pom.xml)

Spring Boot 3.3.5, Java 21, Spring Data JPA, Spring Validation, Lombok, MapStruct 1.6.3, SpringDoc OpenAPI 2.6.0, Oracle JDBC (ojdbc11), H2 (runtime), Flyway.

### Chargement automatique des données (DataInitializer)

`DataInitializer.java` est un composant Spring implémentant `CommandLineRunner` qui s'exécute automatiquement au démarrage de l'application. Si la base de données est vide (`cvRepository.count() == 0`), il insère un CV complet avec des données réelles :

- **1 CV** avec les informations personnelles de Rachid Elkhatiri (nom, titre, localisation, email, LinkedIn, photo, résumé du profil).
- **3 certifications** : OCP Java 17, OCP Java 21, Scrum Foundation Professional Certificate.
- **6 compétences** : Back-end (Java/Spring Boot/Hibernate), Front-end (Angular/TypeScript), BDD (Oracle/PostgreSQL), Architecture (Microservices/REST), DevOps (Docker/Git/CI), Qualité (JUnit/Mockito/TDD).
- **1 expérience** : Développeur Full-Stack Java/Angular chez ADN à Rabat, avec 5 responsabilités détaillées.
- **2 projets** : Gestion des Convocations (architecture microservices, import Excel, attribution automatique) et Moteur de Génération de PDF Bilingues (Spring Boot/Spring Security/Thymeleaf).
- **2 formations** : Master en Ingénierie des SI et Licence Professionnelle en IS, toutes deux à Sup MTI Rabat.
- **3 langues** : Français (Courant), Anglais (Technique), Arabe (Natif).

Ce mécanisme permet de démarrer l'application avec des données de démonstration sans aucune intervention manuelle. Les données sont réinitialisées à chaque redémarrage car le profil `test` utilise `ddl-auto: create-drop`.

---

## Frontend — Angular 17 / Angular Material

### Structure

Le frontend utilise Angular 17 avec le mode **standalone components** (pas de `NgModule`). La configuration est dans `app.config.ts` : router, HttpClient avec intercepteur, et animations asynchrones.

### Routing

`app.routes.ts` définit une route principale avec `LayoutComponent` comme coque (header + `<router-outlet>`), et deux routes enfants lazy-loaded :
- `/cv` → `CvEditorComponent` (éditeur de CV avec formulaires réactifs)
- `/cv/preview` → `CvPreviewComponent` (visualisation et impression du CV)

### Layout

- **`LayoutComponent`** : contient un `<app-header>` fixe en haut et un `<router-outlet>` avec un fond gris (`#f5f5f5`) et un padding-top de 64px pour compenser la toolbar fixe.
- **`HeaderComponent`** : une `mat-toolbar` fixe en haut de l'écran avec l'icône "description", le titre "CV Simple", et le sous-titre "Générateur de CV". Le titre est clikenable et redirige vers `/`.

### CvEditorComponent — Le composant principal

C'est le composant cœur de l'application, situé dans `features/cv/cv-editor.component.ts`. Il gère l'édition complète du CV via un formulaire réactif Angular.

**Barre d'actions :** Le header de l'éditeur contient deux boutons :
- **"Prévisualiser"** (`mat-stroked-button`) — redirige vers `/cv/preview` pour visualiser le CV avec le design formaté.
- **"Enregistrer"** (`mat-raised-button color="accent"`) — sauvegarde les modifications via `PUT /api/cv/{id}`.

**États de l'interface :**
1. **Chargement** : affiche un `mat-spinner` pendant le chargement initial.
2. **Aucun CV** : affiche une carte "Bienvenue" avec un bouton "Créer un CV".
3. **CV chargé** : affiche l'éditeur avec 7 onglets Material.

**Les 7 onglets (`mat-tab-group`) :**
1. **Profil** : champs pour nom complet, titre du poste, localisation, email, LinkedIn URL, photo URL, et textarea pour le résumé.
2. **Expériences** : liste dynamique avec bouton "+". Chaque carte contient titre, entreprise, localisation, dates (début/fin), et descriptions (une par ligne). Bouton de suppression par carte.
3. **Formations** : liste dynamique avec diplôme, établissement, dates de début/fin.
4. **Compétences** : liste dynamique avec catégorie et valeur.
5. **Certifications** : liste dynamique avec nom et description.
6. **Projets** : liste dynamique avec titre, description, points forts (un par ligne), technologies.
7. **Langues** : liste dynamique avec nom et niveau.

**Logique des formulaires :** Chaque section (sauf Profil) est gérée par un `FormArray<FormGroup>`. La méthode `fc(form, key)` est un raccourci pour caster `form.get(key)` en `FormControl`. Les factories (`createExperienceGroup`, `createFormationGroup`, etc.) construisent les groupes avec des valeurs par défaut. La méthode `populateForm` remplit tous les formulaires à partir des données du CV chargé, et `saveCv` reconstruit l'objet `Partial<Cv>` depuis les valeurs des formulaires avant de l'envoyer via le service.

### CvService

`cv.service.ts` est un service Angular injectable qui encapsule tous les appels HTTP vers l'API backend (`http://localhost:8080/api/cv`). Il utilise `HttpClient` et opère un `map` sur chaque réponse pour extraire le champ `data` de l'enveloppe `ApiResponse`. Toutes les opérations CRUD et les opérations sur les sous-éléments (ajout/suppression) sont implémentées.

### Modèle TypeScript

`cv.model.ts` définit les interfaces TypeScript correspondant aux DTOs backend : `PersonalInfo`, `Certification`, `Skill`, `Experience`, `Project`, `Formation`, `Language`, `Cv`, et `ApiResponse<T>`. Les champs optionnels (comme `id`) sont marqués avec `?`.

### Intercepteur HTTP

`api.interceptor.ts` est un intercepteur fonctionnel (`HttpInterceptorFn`) qui ajoute le header `Content-Type: application/json` à toutes les requêtes sortantes.

### Angular Material

Les modules utilisés sont : `MatCardModule`, `MatTabsModule`, `MatFormFieldModule`, `MatInputModule`, `MatButtonModule`, `MatIconModule`, `MatDividerModule`, `MatSnackBarModule`, `MatProgressSpinnerModule`, `MatToolbarModule`. Les animations sont fournies via `provideAnimationsAsync()`.

### CvPreviewComponent — Visualisation du CV

`cv-preview.component.ts` est le composant de visualisation dynamique du CV, situé dans `features/cv-preview/`. Il remplace la page HTML statique `proCv.html` en récupérant les données depuis le backend via l'API REST.

**Fonctionnement :** Au chargement, le composant appelle `CvService.getCv(1)` pour récupérer le CV depuis le backend. Les données sont ensuite injectées dans le template Angular, qui génère dynamiquement chaque section du CV.

**Sections affichées :**
1. **En-tête** — photo de profil (ronde avec bordure sombre), nom complet en grand, titre du poste, localisation, email (lien mailto), LinkedIn (lien externe).
2. **Profil** — paragraphe de résumé du profil professionnel.
3. **Certifications** — liste avec icône trophée, nom et description.
4. **Compétences** — grille 2 colonnes avec catégories et valeurs.
5. **Expériences** — chaque expérience avec titre, dates (début – présent ou fin), entreprise, localisation, et liste à puces des responsabilités (séparées par des retours à la ligne).
6. **Projets** — titre, description, points forts (liste à puces), technologies utilisées.
7. **Formations** — diplôme, établissement, dates.
8. **Langues** — nom et niveau.
9. **Footer** — date de mise à jour (mois et année en cours).

**Fonctionnalités :**
- **Bouton "Imprimer / PDF"** — déclenche `window.print()` pour ouvrir le dialog d'impression du navigateur, permettant d'exporter en PDF.
- **Bouton "Éditer"** — redirige vers `/cv/placeholder` pour modifier le CV.
- **Design responsive** — en dessous de 700px, l'en-tête passe en colonne, la grille compétences passe en 1 colonne, les dates s'empilent.
- **Impression** — la media query `@media print` masque la barre d'actions et retire les ombres/bordures pour un rendu propre.
- **Formatage des dates** — les dates sont affichées en format court français (ex: "Sept. 2024").
- **Gestion des lignes** — les descriptions et highlights sont découpés par `\n` et affichés en liste à puces.

**Styles SCSS :** Le fichier `cv-preview.component.scss` reprend fidèlement le design de `proCv.html` : typographie Segoe UI, palette `#1a1a2e` pour les en-têtes, border-bottom sur les titres de section, grille responsive pour les compétences, et impression optimisée.

---

## Page HTML/CSS Statique (proCv.html + style.css)

À la racine du projet, il y a une page HTML statique `proCv.html` qui représente une version imprimable/visualisable du CV de Rachid Elkhatiri. Elle est stylée par `style.css`.

### Structure HTML

La page est organisée en sections séparées par des bordures et des espacements :

1. **Header** : photo de profil (rond avec bordure sombre), nom en grand, titre du poste, et coordonnées (localisation, email, LinkedIn).
2. **Profil** : paragraphe de présentation du développeur.
3. **Certifications** : liste des certifications (OCP Java 17, OCP Java 21, Scrum Foundation).
4. **Compétences** : grille 2 colonnes avec catégories (Back-end, Front-end, BDD, Architecture, DevOps, Qualité).
5. **Expérience** : postes avec titre, dates, entreprise, et liste à puces des responsabilités.
6. **Projets** : projets détaillés avec description, points forts, et technologies utilisées.
7. **Formation** : diplômes avec établissements et dates.
8. **Langues** : Français, Anglais, Arabe avec niveaux.
9. **Téléchargements** : deux boutons stylés pour télécharger en PDF ou Word (.docx).
10. **Footer** : date de mise à jour du CV.

### Design CSS

Le style est pensé pour l'impression : largeur maximale de 800px centrée, typographie Segoe UI, palette de couleurs sobre (`#1a1a2e` pour les en-têtes), grille responsive pour les compétences, boutons de téléchargement avec effets hover (translateY + ombre + couleur). La media query `@media print` réduit le padding pour l'impression.

---

## Résumé du flux de données

### Flux d'édition

1. L'utilisateur ouvre le frontend Angular sur `localhost:4200`.
2. `CvEditorComponent` tente de charger le CV avec `id=1` via `CvService.getCv(1)`.
3. Le service envoie `GET http://localhost:8080/api/cv/1`.
4. Le controller Spring récupère le CV depuis la base via `CvRepository`, le convertit en `CvDTO` via `CvMapper`, et le retourne enveloppé dans `ApiResponse`.
5. Le frontend affiche les données dans les formulaires réactifs (7 onglets).
6. L'utilisateur modifie les champs et clique "Enregistrer".
7. Le composant reconstruit l'objet CV depuis les formulaires et envoie `PUT /api/cv/1`.
8. Le backend met à jour la base et retourne le CV mis à jour.

### Flux de visualisation

1. L'utilisateur clique sur "Prévisualiser" depuis l'éditeur, ou navigue directement vers `/cv/preview`.
2. `CvPreviewComponent` appelle `CvService.getCv(1)` pour charger les données du CV.
3. Le service envoie `GET http://localhost:8080/api/cv/1`.
4. Le composant injecte les données dans le template Angular, qui génère dynamiquement toutes les sections (profil, certifications, compétences, expériences, projets, formations, langues).
5. L'utilisateur peut cliquer "Imprimer / PDF" pour exporter le CV via le dialog d'impression du navigateur.

---

## Démarrage du Projet — Étapes à suivre

### Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- **Java 21** (JDK) — vérifiable avec `java -version`
- **Maven 3.8+** — vérifiable avec `mvn -version`
- **Node.js 18+** et **npm 9+** — vérifiables avec `node -v` et `npm -v`
- **Oracle Database** (optionnel) — uniquement si vous utilisez le profil `dev`

### Étape 1 — Cloner le projet

```bash
git clone <url-du-depot>
cd cv-simple
```

### Étape 2 — Démarrer le Backend

Le backend utilise deux profils de base de données : `dev` (Oracle local) et `test` (H2 en mémoire, aucune installation requise).

**Option A — Avec H2 (recommandé pour un test rapide) :**

```bash
cd backend
mvn clean spring-boot:run -Dspring-boot.run.profiles=test

mvn clean compile; if ($?) { mvn spring-boot:run "-Dspring-boot.run.profiles=test" }
```

Cette commande compile le projet, télécharge les dépendances, et lance le serveur Spring Boot sur le port `8080` avec une base H2 éphémère en mémoire. Aucune base de données externe n'est nécessaire. Les tables sont créées automatiquement à chaque démarrage (`ddl-auto: create-drop`).

**Option B — Avec Oracle (développement) :**

```bash
cd backend
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```

Cette variante utilise le profil `dev` qui se connecte à Oracle (`localhost:1521/XE`). Assurez-vous qu'Oracle tourne et que les identifiants dans `application.yml` (`RACHID` / `Rachid123`) sont corrects. Flyway est activé pour gérer les migrations de schéma dans le schéma `cv_simple`.

**Vérification :** Une fois démarré, ouvrez http://localhost:8080/swagger-ui.html dans votre navigateur pour voir la documentation Swagger de toutes les endpoints API.

### Étape 3 — Démarrer le Frontend

Dans un **nouveau terminal** (le backend doit rester lancé) :

```bash
cd frontend
npm install
ng serve
```

`npm install` installe les dépendances Angular (Angular Material, RxJS, etc.). `ng serve` compile l'application et lance le serveur de développement sur http://localhost:4200 avec le rechargement à chaud (hot reload).

**Vérification :** Ouvrez http://localhost:4200 dans votre navigateur. Vous devriez voir l'interface de l'éditeur de CV chargée automatiquement avec les données du CV par défaut. Cliquez sur "Prévisualiser" pour voir le CV formaté, ou éditez-le via les onglets.

### Étape 4 — Tester la page statique (optionnel)

Pour visualiser le CV formaté sans le backend, ouvrez directement le fichier `proCv.html` à la racine du projet dans votre navigateur :

```
double-clique sur proCv.html
```

Ceci affiche une version imprimable et stylée du CV avec les sections profil, certifications, compétences, expérience, projets, formation, langues et téléchargements.

### Étape 5 — Tester l'API (optionnel)

Vous pouvez interagir directement avec l'API via Swagger UI ou avec `curl` :

```bash
# Récupérer le CV avec l'id 1
curl http://localhost:8080/api/cv/1

# Créer un nouveau CV
curl -X POST http://localhost:8080/api/cv \
  -H "Content-Type: application/json" \
  -d '{"personalInfo":{"fullName":"Jean Dupont","jobTitle":"Développeur","email":"jean@example.com"},"profileSummary":"Test"}'
```

### Résumé des ports

| Service | Port | URL |
|---------|------|-----|
| Backend Spring Boot | 8080 | http://localhost:8080 |
| Swagger UI | 8080 | http://localhost:8080/swagger-ui.html |
| Console H2 | 8080 | http://localhost:8080/h2-console |
| Frontend — Éditeur | 4200 | http://localhost:4200/cv |
| Frontend — Prévisualisation | 4200 | http://localhost:4200/cv/preview |
| Page statique (ancien) | — | `proCv.html` (fichier local) |

### En cas de problème

- **Port 8080 déjà utilisé** : arrêtez le processus占用 le port ou modifiez `server.port` dans `application.yml`.
- **Erreurs de compilation Maven** : lancez `mvn clean install -DskipTests` pour forcer la régénération de MapStruct.
- **npm install échoue** : supprimez le dossier `node_modules` et le fichier `package-lock.json`, puis relancez `npm install`.
- **Le frontend ne trouve pas le backend** : vérifiez que le backend tourne sur le port 8080 et que l'URL dans `cv.service.ts` (`http://localhost:8080/api/cv`) est correcte.
- **Erreur "Erreur lors de la création du CV"** : relancez le backend — le `DataInitializer` charge automatiquement les données au démarrage, le CV est disponible directement sans création manuelle.