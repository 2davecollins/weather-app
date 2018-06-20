### Weather App

#### github  https://github.com/2davecollins/weather-app.git
#### web site  http://web-app.surge.sh/

### Download from github

Project uses gulp to copy files to dist folder compile scss and run live server.
setup to avoid global  dependencies gulp can be called locally with npm start

```bash
# install dependencies
npm install or yarn

# start server with 
npm start

# test javascript
npm test

```

##### Project uses ES6 features where appropriate

* fat arrow functions
* const and let where appropriate
* es6 Class to create WxMaps and Cards for displays.
* spread operator map and filter to decode json data
<br/>
<br/>


Node Support | Browser Support
------------ | -------------
 (https://node.green/#ES2017) | (https://caniuse.com/#search=es6)




![README](http://www.plantuml.com/plantuml/png/RP51IyGm48NlXVw779KbVs5PiGgYotfP5azbIAOs6DibCyeMyRyxQTg6ofwIztNclV2w8uR0Nv--BCh2U21Izn2i-YaBfOtZ8PuMniEPlgEHjx9ZtRVSwrhjaTlUabn5Rzwnmm2CqUNcDX6UnMzEELtsS4unwAyPcO1Y8qDnSRLwPEVbPUDoiXVrueZ7FBMX_qJBpDthK_tyy3QD213dO_1PF_O13H1dQ3n2cF746cJJhfd62mSmN053pgjWE3Gdn8_yg5LSh8Jo-59NKh7WIIuzL8xE7eQbnxa6xR5XlKsDNliGlIFVOMVbJ_y1 "README")





#####  tested on chrome 66.0.3359.181 ok
#####  tested on firefox 60.0.1 (64-bit) Quantum ok
#####  tested on edge Microsoft Edge 42.17134.1.0 failed spread operator
#####  tested on Internet Exploror 11 failed es6 fat arrow functions

#####  didnt use babel compiler test was on use of es6 css3 and html5 


##### With more time project could be improved

1. Temperature retrieved from json captured every three hours 8 readings per day only taking a sample of one per day should really get mean temp per day Icon similarly selected one per day.
2. Selection of Cities by checkbox have downloaded the world city list should be able to use this file to allow selection of any city for forecast.
3. Slould be able to center weather maps on a selected city. Had trouble getting layers to work well together.
4. There Should be a way to sort the displays by temperature or name.
5. Too much information returned could have chosed more parameters to display.


###### added eslint can be found on branch eslint
