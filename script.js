// ACCESS HTML ELEMENTS
const dog_container = document.getElementById("dog-container");
const dog = document.querySelector(".dog");

// sound effect variables
const bark = document.getElementById("bark");
const pant = document.getElementById("pant");
const eat = document.getElementById("eat");
const bath = document.getElementById("bath");
const sleep = document.getElementById("sleep");
const upgrade = document.getElementById("upgrade");

// upgrade variables
const points_dis = document.getElementById("pets");
let pets = 0;
let upgrade_cost = 10;
let boost = 5;
const boost_text = document.getElementById("boost-text");
let name_val = "Rufus";

// warning variables
const no_warnings = document.getElementById("no-warnings");
const sad_icon = document.getElementById("sad");
const hungry_icon = document.getElementById("hungry");
const sick_icon = document.getElementById("sick");
const dirty_icon = document.getElementById("dirty");
const tired_icon = document.getElementById("tired");
let active_icons = [];

// stat displays
const happy_dis = document.getElementById("happy-stat");
const hunger_dis = document.getElementById("hunger-stat");
const health_dis = document.getElementById("health-stat");
const clean_dis = document.getElementById("clean-stat");
const energy_dis = document.getElementById("energy-stat");

// get stat colors from CSS variables
const rootStyles = getComputedStyle(document.documentElement);
const happy = rootStyles.getPropertyValue('--happy').trim();
const sad = rootStyles.getPropertyValue('--sad').trim();
const hungry = rootStyles.getPropertyValue('--hungry').trim();
const sick = rootStyles.getPropertyValue('--sick').trim();
const dirty = rootStyles.getPropertyValue('--clean').trim();
const tired = rootStyles.getPropertyValue('--energy').trim();

// access buttons 
const play_btn = document.getElementById("play-btn");
const feed_btn = document.getElementById("feed-btn");
const sick_btn = document.getElementById("medicine-btn");
const clean_btn = document.getElementById("clean-btn");
const sleep_btn = document.getElementById("sleep-btn");
const upgrade_btn = document.getElementById("upgrade-btn");
const btns = [play_btn, feed_btn, sick_btn, clean_btn];

// initialize stats
let happy_stat = 100;
let hunger_stat = 0;
let health_stat = 100;
let clean_stat = 100;
let energy_stat = 100;

let colors_by_occurrance = []; // used to track which order background colors come, used for healing stats

let dog_img_timeout = null;
let dog_sleeping = false;

window.onload = function() {
    if (localStorage.getItem("happy_stat") !== null) {
        // load and display stats
        happy_stat = localStorage.getItem("happy_stat");
        hunger_stat = localStorage.getItem("hunger_stat");
        health_stat = localStorage.getItem("health_stat");
        clean_stat = localStorage.getItem("clean_stat");
        energy_stat = localStorage.getItem("energy_stat");
        display_stats();

        // load and set background
        colors_by_occurrance = JSON.parse(localStorage.getItem("colors_by_occurrance")) || [];
        dog_container.style.background = colors_by_occurrance[colors_by_occurrance.length-1];
    
        // load and display icons
        active_icons = JSON.parse(localStorage.getItem("active_icons")) || [];
        if (active_icons.length > 0) {
            no_warnings.style.display = "none";
            for (icon_id of active_icons) {
                icon = document.getElementById(icon_id);
                icon.style.display = "block";
            }
        } else {
            no_warnings.style.display = "block";
        }

        // load and display upgrade statss
        pets = Number(localStorage.getItem("pets"));
        points_dis.innerText = pets;
        boost = Number(localStorage.getItem("boost"));
        boost_text.innerHTML = "Boost: " + boost;
        upgrade_cost = Number(localStorage.getItem("upgrade_cost"));
        upgrade_btn.innerHTML = "Upgrade - " + upgrade_cost + " &#9995;";
    
        // load and display name
        name_val = localStorage.getItem("name_val");
        document.getElementById("name").value = name_val;
    }
}

function display_stats() {
    happy_dis.innerText = "Happiness: " + happy_stat;
    hunger_dis.innerText = "Hunger: " + hunger_stat;
    health_dis.innerText = "Health: " + health_stat;
    clean_dis.innerText = "Cleanliness: " + clean_stat;
    energy_dis.innerText = "Energy: " + energy_stat;
}

// autosave data every 3s
const save = setInterval(function(){
    // save stats
    localStorage.setItem("happy_stat", happy_stat);
    localStorage.setItem("hunger_stat", hunger_stat);
    localStorage.setItem("health_stat", health_stat);
    localStorage.setItem("clean_stat", clean_stat);
    localStorage.setItem("energy_stat", energy_stat);

    // save bg colors
    localStorage.setItem("colors_by_occurrance", JSON.stringify(colors_by_occurrance));

    // save icons
    localStorage.setItem("active_icons", JSON.stringify(active_icons));

    // save upgrade stats
    localStorage.setItem("pets", pets);
    localStorage.setItem("boost", boost);
    localStorage.setItem("upgrade_cost", upgrade_cost);

    // save dog name 
    localStorage.setItem("name_val", document.getElementById("name").value);
}, 3000);

// clear local storage for debugging
function reset() {
    happy_stat = 100;
    hunger_stat = 0;
    health_stat = 100;
    clean_stat = 100;
    energy_stat = 100;
    colors_by_occurrance = [];
    active_icons = [];
    pets = 0;
    boost = 5;
    upgrade_cost = 10;
    name_val = "Rufus";
}

// happy stat will decrease every 3 seconds
const happy_interval = setInterval(function(){
    if (happy_stat > 0){
        happy_stat--;
        happy_dis.innerHTML = "Happiness: " + happy_stat;
    }
    if (happy_stat == 49) {
        colors_by_occurrance.push(sad);
        dog_container.style.background = sad;
        no_warnings.style.display = "none";
        sad_icon.style.display = "block";
        active_icons.push("sad");
    }
}, 3000);

// hunger stat will increase every 2 seconds
const hunger_interval = setInterval(function(){
    if (hunger_stat < 100){
        hunger_stat++;
        hunger_dis.innerHTML = "Hunger: " + hunger_stat;
    }
    if (hunger_stat == 51) {
        colors_by_occurrance.push(hungry);
        dog_container.style.background = hungry;
        no_warnings.style.display = "none";
        hungry_icon.style.display = "block";
        active_icons.push("hungry");
    }
}, 2000);

// health stat will decrease every 7 seconds
const health_interval = setInterval(function(){
    if (health_stat > 0){
        health_stat--;
        health_dis.innerHTML = "Health: " + health_stat;
    }
    if (health_stat == 49) {
        colors_by_occurrance.push(sick);
        dog_container.style.background = sick;
        no_warnings.style.display = "none";
        sick_icon.style.display = "block";
        active_icons.push("sick");
    }
}, 7000);

// cleanliness stat will decrease every 5 seconds
const clean_interval = setInterval(function(){
    if (clean_stat > 0){
        clean_stat--;
        clean_dis.innerHTML = "Cleanliness: " + clean_stat;
    }
    if (clean_stat == 49) {
        colors_by_occurrance.push(dirty);
        dog_container.style.background = dirty;
        no_warnings.style.display = "none";
        dirty_icon.style.display = "block";
        active_icons.push("dirty");
    }
}, 5000);

// energy stat will decrease every 2.5 seconds
const energy_interval = setInterval(function(){
    if (energy_stat > 0){
        energy_stat--;
        energy_dis.innerHTML = "Energy: " + energy_stat;
    }
    if (energy_stat == 49) {
        colors_by_occurrance.push(tired);
        dog_container.style.background = tired;
        no_warnings.style.display = "none";
        tired_icon.style.display = "block";
        active_icons.push("tired");
    }
}, 2500);

// get 1 point every time you pet the dog
dog.onclick = function() {
    const bark_play = Math.floor(Math.random()*101);
    if (bark_play > 80) { // only bark sometimes
        bark.play();
    }
    pets++;
    points_dis.innerText = pets;
}

// checks if icon is hidden
function isHidden(el) {
    return getComputedStyle(el).display === "none";
}

// checks if all icons are disabled
// if they are, set the no warning text to block
function check_icons() {
    if (isHidden(sad_icon) && isHidden(hungry_icon) && isHidden(sick_icon) && isHidden(dirty_icon)){
        no_warnings.style.display = "block";
    }
}

// BUTTON FUNCTIONS
// disables button for 10s after click
function disable_btn(btn, time) {
    btn.disabled = true;
    setTimeout(function(){
        if (!dog_sleeping) {
            btn.disabled = false;
        }
    }, time)
}

// switches dog image for 5 seconds
function switch_img(source) {
    if (dog_img_timeout != null) {
        clearTimeout(dog_img_timeout); // clear previous timeouts
    }

    dog.src = source;
    dog_img_timeout = setTimeout(function() {
        dog.src = "images/dog.png";
        dog_img_timeout = null;
    }, 5000);
}

// remove color
function updateColor(color) {
    const index = colors_by_occurrance.indexOf(color);
    if (index != -1) {
        colors_by_occurrance.splice(index, 1);
    }
    if (colors_by_occurrance.length == 0) {
        dog_container.style.background = happy;
    } else {
        dog_container.style.background = colors_by_occurrance[colors_by_occurrance.length-1];
    }
}

// play fetch
play_btn.onclick = function() {
    pant.play();
    switch_img("images/fetch.png");
    happy_stat += boost;
    if (happy_stat > 100) { // max happy stat is 100
        happy_stat = 100;
    }
    happy_dis.innerHTML = "Happiness: " + happy_stat;

    if (happy_stat >= 50) {
        updateColor(sad);
        sad_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(sad_icon), 1);
        check_icons();
    }
    disable_btn(play_btn, 15000);
}

// feed dog
feed_btn.onclick = function() {
    eat.play();
    switch_img("images/eat.png");
    setTimeout(function(){
        eat.pause();
        eat.currentTime = 0;
    }, 5000);

    hunger_stat -= boost;
    if (hunger_stat < 0) { // max happy stat is 100
        hunger_stat = 0;
    }
    hunger_dis.innerHTML = "Hunger: " + hunger_stat;

    if (hunger_stat <= 51) {
        updateColor(hungry);
        hungry_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(hungry_icon), 1);
        check_icons();
    }
    disable_btn(feed_btn, 10000);
}

// give dog medicine
sick_btn.onclick = function() {
    bark.play();
    switch_img("images/medicine.png");
    health_stat += boost;
    if (health_stat > 100) { // max happy stat is 100
        health_stat = 100;
    }
    health_dis.innerHTML = "Health: " + health_stat;

    if (health_stat >= 50) {
        updateColor(sick);
        sick_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(sick_icon), 1);
        check_icons();
    }
    disable_btn(sick_btn, 35000);
}

// give dog a bath
clean_btn.onclick = function() {
    bath.play();
    switch_img("images/bath.png");
    clean_stat += boost;
    if (clean_stat > 100) { // max happy stat is 100
        clean_stat = 100;
    }
    clean_dis.innerHTML = "Cleanliness: " + clean_stat;

    if (clean_stat >= 50) {
        updateColor(dirty);
        dirty_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(dirty_icon), 1);
        check_icons();
    }
    disable_btn(clean_btn, 25000);
}

// disables all buttons for 10s
function disable_btn_sleep(btn, time) {
    btn.disabled = true;
    setTimeout(function() {
        btn.disabled = false;
    }, time)
}

function disable_btns() {
    for (btn of btns) {
        disable_btn_sleep(btn, 15000);
    }
}

// put dog to sleep
sleep_btn.onclick = function() {
    sleep.play();
    if (dog_img_timeout != null) {
        clearTimeout(dog_img_timeout);
    }
    dog_sleeping = true;
    dog.src = "images/sleep.png";
    document.body.style.background = "#8888FF";
    energy_stat = 100;
    energy_dis.innerHTML = "Energy: 100";
    disable_btn(sleep_btn, 30000);
    disable_btns();

    setTimeout(function(){ // dog wakes up after 15s
        clearTimeout(dog_img_timeout);
        dog.src = "images/dog.png";
        document.body.style.background = "#eff7ff";
        updateColor(tired);
        tired_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(tired_icon), 1);
        check_icons();
        dog_sleeping = false;
    }, 15000);
}

// upgrades boost
upgrade_btn.onclick = function() {
    if ((pets >= upgrade_cost) && (boost <= 50)) {
        upgrade.play();
        pets -= upgrade_cost;
        points_dis.innerText = pets;

        boost++;
        boost_text.innerHTML = "Boost: " + boost;

        upgrade_cost += 2;
        upgrade_btn.innerHTML = "Upgrade - " + upgrade_cost + " &#9995;";
    }
    if (boost >= 50) {
        upgrade_btn.disabled = true;
    }
}