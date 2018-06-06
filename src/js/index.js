// const DAY_0    = Symbol('Sun');
// const DAY_1    = Symbol('Mon');
// const DAY_2    = Symbol('Tue');
// const DAY_3    = Symbol('Wed');
// const DAY_4    = Symbol('Thur');
// const DAY_5    = Symbol('Fri');
// const DAY_6    = Symbol('Sat');

document.addEventListener('DOMContentLoaded', function () {
    //wait for document to be loaded 
    console.log("Douument is Ready ");
    const elems = document.querySelectorAll('.fixed-action-btn');
    const instancesfab = M.FloatingActionButton.init(elems, {
        hoverEnabled: false
    });

    const elemsc = document.querySelectorAll('.carousel');
    const instancescar = M.Carousel.init(elemsc, {
        duration: 200
    });

    const elemsm = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elemsm, {
        
    });

    const carNext = document.getElementById("carouselright");
    carNext.addEventListener('click', () => {
        instancescar[0].prev();
    });
    const carPrev = document.getElementById("carouselleft");
    carPrev.addEventListener('click', () => {
        instancescar[0].next();
    });

    const cityListBtn = document.getElementById("updatecitylist");
    cityListBtn.addEventListener('click', () =>{
        console.log("update City List");
        getCityList();                      
    });
    
    // create maps on load   
    createMapDisplay();
    //list of cities from checkbox saved to localstorage
    let cityList =  JSON.parse(localStorage.getItem("savedCities"));
    //if no data in localstorage set from default dublin checked;
    if(cityList){
        setCityList(cityList);
        setTimeout(fetchForecast,500);

    }else{
        getCityList();
    }    
  
});

(function () { 

    getCityList = () => {
        const cityList = [
            {checked:document.getElementById("dublin").checked, city:"Dublin",code:"IE", btn:"dublin" },
            {checked:document.getElementById("cork").checked, city:"Cork",code:"IE", btn:"cork" },
            {checked:document.getElementById("galway").checked, city:"Galway",code:"IE", btn:"galway" },
            {checked:document.getElementById("london").checked, city:"London",code:"UK",btn:"london" },
            {checked:document.getElementById("amsterdam").checked, city:"Amsterdam",code:"NL", btn:"amsterdam" },
            {checked:document.getElementById("berlin").checked, city:"Berlin",code:"DE", btn:"berlin" },
            {checked:document.getElementById("madrid").checked, city:"Madrid",code:"ES", btn:"madrid" }
        
        ];
        localStorage.setItem("savedCities", JSON.stringify(cityList));
        setTimeout(fetchForecast,500);       
    }
    setCityList = (cityList) => cityList.forEach( obj => document.getElementById(obj.btn).checked = obj.checked)

    getAPI_KEY = () => '556e345dbb8e85c073a5dde9e4df820b';   
    getURLMap = () => 'https://tile.openweathermap.org/map/'; 

    getMapUrl = (type) => {
        const api = getAPI_KEY();
        const url = getURLMap();        
        return `${url}${type}/{z}/{x}/{y}.png?appid=${api}`;
    }
    getForecastUrl = (city,code) => {       
        let api = getAPI_KEY ();        
        return `http://api.openweathermap.org/data/2.5/forecast?q=${city},${code}&APPID=${api}` 
    }
    clearForecast = () => getCards([]);
    fetchForecast = () => {       
        let URL;             
        const cardArray = [];        
        const forecastList = JSON.parse(localStorage.getItem("savedCities"));
        
        forecastList.forEach( (obj) => {
            if(obj.checked){
                URL = getForecastUrl(obj.city,obj.code);
                fetch(URL).then(function(res) {
                    // res instanceof Response == true.
                    if (res.ok) {
                      res.json().then(function(data) {                       
                        cardArray.push(extractData(data));
                        getCards(cardArray);
                      });
                    } else {
                      console.log("response status", res.status);
                    }
                  }, function(e) {
                    console.log("Fetch failed!", e);
                });
            }           
        });   

    }    

    extractData = (dataArr) => {
       
        //destructure returned data from open weather
        const {city, list, ...restOfObject} = dataArr;
        const subset = {city, list};
        const cityName = city.name;
        const divid = city.id;
        //dt not current time use dt_txt
        const day = new Date(list[0].dt_txt).getDay();

        //api returns data every 3 hours for simplicity getting values same time each day
        //next five days        
        const all_icons = list.map(ic => ic.weather[0].icon);       
        const icons = all_icons.filter((ic,index) => index % 8 == 0 );       
        //temp in kelvin convert to celcius       
        const kelvin = 273.15;
        const allTemps = list.map(val => ({              
              y: Number((val.main.temp - kelvin).toFixed(1))           
        }));         
        const dailyTemp = allTemps.filter((temp,index) => index % 8 === 0);
        
        o = Object.create(null);
        o.city  = cityName || "";
        o.icons = icons || ['01n','01n','01n','01n','01n'];
        o.color = "red";    //TODO based on temp ??
        o.day   = getDayOfWeek(day) || "Mon";
        o.data  = dailyTemp || [];
        o.chartdiv = "id"+divid;      

       return o;
    }
    //cant use city name as html id some cities have spaces
    //plan b use city id add id to number as html tag
    myTrim = (str) => str.replace(/\s+/g, '');
    // get first day of week forecast for card

    getDayOfWeek = (day) => {
        switch (day) {
            case 0:
                return "Sun";
            case 1:
                return "Mon";
            case 2:
                return "Tue";
            case 3:
                return "Wed";
            case 4:
                return "Thur";
            case 5:
                return "Fri";
            case 6:
                return "Sat";
            default:
                throw new Exception('Unknown Day: '+day);
        }
    }  

   
    setUrl = ( url ) =>  URL = url;  
    getCards = (cardArray) => {
        //reset the display        
        document.getElementById("wxcards").innerHTML = "";
        
        if(cardArray.length == 0){
            return;
        };
        cardArray.forEach((a) => {
            getCard(a);
            getChart(a.chartdiv, a.data, a.color);
        });    
    };
    getCard = (Obj) => {
        const c = new Card(Obj);        
        const objTo = document.getElementById('wxcards');
        objTo.appendChild(c.generateCard());
    };
    getChart = (id, data, color) => {
        var chartdisplay = new CanvasJS.Chart(id, {
            theme: "light2",
            title: {
                text: "Forecast"
        },
            data: [
                {
                    //bar chart   
                    type: "column",
                    color: color,
                    dataPoints: data,
                },
                //if want line chart on same chart
                {
                    //types "doughnut", "line", "splineArea",column
                    type: "line",
                    color: "blue",
                    dataPoints: data,
                }
            ]
        });
        chartdisplay.render();
    }

    createMapDisplay =  () => {
   
        let rain_url = getMapUrl("precipitation_new");
        let pressure_url = getMapUrl("pressure_new");
        let temp_url = getMapUrl("temp_new");
        let wind_url = getMapUrl("wind_new");
           
        rain = new WxMap('rainmapid');
        pressure = new WxMap('pressuremapid');
        heat = new WxMap('heatmapid');
        wind = new WxMap('windmapid');
    
        rain.createMap(rain_url);
        pressure.createMap(pressure_url);
        heat.createMap(temp_url);
        wind.createMap(wind_url);    
    }
              

    return {        
        setUrl,
        getCards,
        fetchForecast,
        createMapDisplay,
        getDayOfWeek,
        extractData
    };

})();


class WxMap {
    constructor(el) {
        this.el = el;
    }
    createMap(type) {              
        
        const map = new L.map(this.el, {
            center: [53, -6.09],
            minZoom: 3,
            zoom: 3,
            dragging: false,
            doubleClickZoom: false,
            scrollWheelZoom: false           
        });

        L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( map );
        const layer = L.tileLayer(type);
        layer.addTo( map );        
        
    }
}

class Card {
    constructor(obj) {
        this.city = obj.city;
        this.day = obj.day;
        this.icons = obj.icons;
        this.chartdiv = obj.chartdiv;       
    }
    get cardDiv() {
        return this.generateCard();
    }    
    generateCard() {        
        const markup = `       
            <div class="card-panel teal">
                <h5 class="card-title white-text">${this.city}</h5>
                <p class="white-text"><span>${this.day}</span></p>
               
                <div class="row">                   
                    <div class="col s2"><img src="http://openweathermap.org/img/w/${this.icons[0]}.png" alt="Smiley face"></div>
                    <div class="col s2"><img src="http://openweathermap.org/img/w/${this.icons[1]}.png" alt="Smiley face"></div>
                    <div class="col s2"><img src="http://openweathermap.org/img/w/${this.icons[2]}.png" alt="Smiley face"></div>
                    <div class="col s2"><img src="http://openweathermap.org/img/w/${this.icons[3]}.png" alt="Smiley face"></div>
                    <div class="col s2"><img src="http://openweathermap.org/img/w/${this.icons[4]}.png" alt="Smiley face"></div>
                </div>              
                <div id=${this.chartdiv} style="height: 200px; width: 100%;"></div>            
                
            </div>       
        `;
        const card = document.createElement("div");
        card.className = "col s12 m6";
        card.innerHTML = markup;
        return card;
    }
}     