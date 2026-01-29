// TODO: add audio
// TODO: disable all buttons when dog is sleeping

// ACCESS HTML ELEMENTS
const dog_container = document.getElementById("dog-container");
const dog = document.querySelector(".dog");

// sound effect variables
const bark = document.getElementById("bark");
const pant = document.getElementById("pant");
const eat = document.getElementById("eat");

// upgrade variables
const points_dis = document.getElementById("pets");
let pets = 0;
let upgrade_cost = 10;
let boost = 5;
const boost_text = document.getElementById("boost-text");

// warning variables
const no_warnings = document.getElementById("no-warnings");
const sad_icon = document.getElementById("sad");
const hungry_icon = document.getElementById("hungry");
const sick_icon = document.getElementById("sick");
const dirty_icon = document.getElementById("dirty");
const tired_icon = document.getElementById("tired");

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

// initialize stats
let happy_stat = 100;
let hunger_stat = 0;
let health_stat = 100;
let clean_stat = 100;
let energy_stat = 100;

let colors_by_occurance = []; // used to track which order background colors come, used for healing stats

// happy stat will decrease every 3 seconds
const happy_interval = setInterval(function(){
    if (happy_stat > 0){
        happy_stat--;
        happy_dis.innerHTML = "Happiness: " + happy_stat;
    }
    if (happy_stat == 49) {
        colors_by_occurance.push(sad);
        dog_container.style.background = sad;
        no_warnings.style.display = "none";
        sad_icon.style.display = "block";
    }
}, 3000);

// hunger stat will increase every 2 seconds
const hunger_interval = setInterval(function(){
    if (hunger_stat < 100){
        hunger_stat++;
        hunger_dis.innerHTML = "Hunger: " + hunger_stat;
    }
    if (hunger_stat == 51) {
        colors_by_occurance.push(hungry);
        dog_container.style.background = hungry;
        no_warnings.style.display = "none";
        hungry_icon.style.display = "block";
    }
}, 2000);

// health stat will decrease every 7 seconds
const health_interval = setInterval(function(){
    if (health_stat > 0){
        health_stat--;
        health_dis.innerHTML = "Health: " + health_stat;
    }
    if (health_stat == 49) {
        colors_by_occurance.push(sick);
        dog_container.style.background = sick;
        no_warnings.style.display = "none";
        sick_icon.style.display = "block";
    }
}, 7000);

// cleanliness stat will decrease every 5 seconds
const clean_interval = setInterval(function(){
    if (clean_stat > 0){
        clean_stat--;
        clean_dis.innerHTML = "Cleanliness: " + clean_stat;
    }
    if (clean_stat == 49) {
        colors_by_occurance.push(dirty);
        dog_container.style.background = dirty;
        no_warnings.style.display = "none";
        dirty_icon.style.display = "block";
    }
}, 5000);

// energy stat will decrease every 2.5 seconds
const energy_interval = setInterval(function(){
    if (energy_stat > 0){
        energy_stat--;
        energy_dis.innerHTML = "Energy: " + energy_stat;
    }
    if (energy_stat == 49) {
        colors_by_occurance.push(tired);
        dog_container.style.background = tired;
        no_warnings.style.display = "none";
        tired_icon.style.display = "block";
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
        btn.disabled = false;
    }, time)
}

// play fetch
play_btn.onclick = function() {
    pant.play();
    happy_stat += boost;
    if (happy_stat > 100) { // max happy stat is 100
        happy_stat = 100;
    }
    happy_dis.innerHTML = "Happiness: " + happy_stat;

    if (happy_stat >= 50) {
        if (sad.includes(colors_by_occurance)) {
            colors_by_occurance.splice(colors_by_occurance.indexOf(sad), 1);
        }
        if (colors_by_occurance.length == 0) {
            dog_container.style.background = happy;
        } else {
            dog_container.style.background = colors_by_occurance[colors_by_occurance.length-1];
        }
        sad_icon.style.display = "none";
        check_icons();
    }
    disable_btn(play_btn, 15000);
}

// feed dog
feed_btn.onclick = function() {
    eat.play();
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
        if (hungry.includes(colors_by_occurance)) {
            colors_by_occurance.splice(colors_by_occurance.indexOf(hungry), 1);
        }
        if (colors_by_occurance.length == 0) {
            dog_container.style.background = happy;
        } else {
            dog_container.style.background = colors_by_occurance[colors_by_occurance.length-1];
        }
        hungry_icon.style.display = "none";
        check_icons();
    }
    disable_btn(feed_btn, 10000);
}

// give dog medicine
sick_btn.onclick = function() {
    bark.play();
    health_stat += boost;
    if (health_stat > 100) { // max happy stat is 100
        health_stat = 100;
    }
    health_dis.innerHTML = "Health: " + health_stat;

    if (health_stat >= 50) {
        if (sick.includes(colors_by_occurance)) {
            colors_by_occurance.splice(colors_by_occurance.indexOf(sick), 1);
        }
        if (colors_by_occurance.length == 0) {
            dog_container.style.background = happy;
        } else {
            dog_container.style.background = colors_by_occurance[colors_by_occurance.length-1];
        }
        sick_icon.style.display = "none";
        check_icons();
    }
    disable_btn(sick_btn, 35000);
}

// give dog a bath
clean_btn.onclick = function() {
    clean_stat += boost;
    if (clean_stat > 100) { // max happy stat is 100
        clean_stat = 100;
    }
    clean_dis.innerHTML = "Cleanliness: " + clean_stat;

    if (clean_stat >= 50) {
        if (dirty.includes(colors_by_occurance)) {
            colors_by_occurance.splice(colors_by_occurance.indexOf(dirty), 1);
        }
        if (colors_by_occurance.length == 0) {
            dog_container.style.background = happy;
        } else {
            dog_container.style.background = colors_by_occurance[colors_by_occurance.length-1];
        }
        dirty_icon.style.display = "none";
        check_icons();
    }
    disable_btn(clean_btn, 25000);
}

// put dog to sleep
sleep_btn.onclick = function() {
    dog.src = "images/sleep.png";
    document.body.style.background = "#8888FF";
    disable_btn(sleep_btn, 30000);

    setTimeout(function(){ // dog wakes up after 10s
        dog.src = "images/dog.png";
        document.body.style.background = "#eff7ff";
        energy_stat = 100;
        energy_dis.innerHTML = "Energy: " + clean_stat;
        if (energy_stat >= 50) {
            if (tired.includes(colors_by_occurance)) {
                colors_by_occurance.splice(colors_by_occurance.indexOf(tired), 1);
            }
            if (colors_by_occurance.length == 0) {
                dog_container.style.background = happy;
            } else {
                dog_container.style.background = colors_by_occurance[colors_by_occurance.length-1];
            }
            tired_icon.style.display = "none";
            check_icons();
        }
    }, 10000);
}

// upgrades boost
upgrade_btn.onclick = function() {
    if ((pets >= upgrade_cost) && (boost <= 50)) {
        pets -= upgrade_cost;
        points_dis.innerText = pets;

        boost++;
        boost_text.innerHTML = "Boost: " + boost;

        upgrade_cost += 5;
        upgrade_btn.innerHTML = "Upgrade - " + upgrade_cost + " &#9995;";
    }
    if (boost >= 50) {
        upgrade_btn.disabled = true;
    }
}