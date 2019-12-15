# tws-tp3 : VideoChat utilisant WebRTC
### Auteurs
BENKARRAD Alaa Eddine <br/>
AISSAOUI Abdelwalid

### Build et Deploiement
#### Preparation
1. installer les packages npm 
```bash
npm install
```
2. build 
```bash
npm build 
```
#### Production
Demarer le serveur en mode production
```bash
npm start 
```
#### Developpement
 Lancer en mode dev
```bash
npm run dev 
```
#### Deploiement
 le deploiement sur heroku se fait automatiquement dès le 
 push sur github.
 
### Testing
#### Environment du test
Nous avons réussi à faire fonctionner notre solution sur l'environement suivant :
- os : ubuntu 19.10 et windows 10
- browser : google chrome (Version 79.0.3945.79 et 78.0.3904.108)

`Ainsi, nous avons testé l'application sur firfox, et ça n'a pas fonctionnée.`
### Execution
1. accedez au site ensuite a la version remote 
```http request
https://tws-tp3-webrtc.herokuapp.com/
```
2. entrez l'username souhaité et cliquer sur ok
3. cliquez sur le button start pour demarrer la webcam
4. refaire les étapes 1,2 et 3 avec un autre utilisateur (autre machine ou navigateur)
5. a ce stade vous aurez la liste des utilisateur connectés, cliquer sur le button d'appel pour appeler.
6. finalement, vous aurez le button hangUp pour raccrocher 
