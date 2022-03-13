import TelegramBot  from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import moment from 'moment'
import fs from 'fs'
import fetch from 'node-fetch'
import {CronJob} from 'cron'
dotenv.config()

const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});


function getBirthday(){
  let birthday = fs.readFileSync('./birthday.json', 'utf-8')
  birthday = JSON.parse(birthday)
  for(const elt of birthday){
    const DATE = moment().format('DD/MM/YYYY')
    if(elt.birthday.substring(0,5) === DATE.substring(0,5) ){
      const AGE = moment(new Date(elt.birthday)).fromNow()
      return { name: elt.name, age: AGE}
    }
  }
}

/**
 * WEATHER FETCH
 */
const sendWeather = new CronJob('00 00 07 * * *', async () => {
  let weather = {
    temp: null,
    min: null,
    max: null
  }
  // bot.on('message', (msg) => {
  //   const chatId = msg.chat.id;
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${process.env.CITY}&appid=${process.env.API}`)
      const data = await response.json()
      weather.temp = (parseFloat(data.main.temp) - 273.15).toFixed(1)
      weather.min = (parseFloat(data.main.temp_min) - 273.15).toFixed(1)
      weather.max = (parseFloat(data.main.temp_max) - 273.15).toFixed(1)
      // });
    }catch(err){
      console.log(err)
    }
    
    if(weather.temp !== null){
      
      
      // CHECK BIRTH
      const BIRTH = getBirthday()
      if(BIRTH){
        console.log(BIRTH)
        bot.sendMessage( '509416027', `Il fait actuellement ${weather.temp}°C. Mais attention, il fera minimum ${weather.min}°C et maximum ${weather.max}°C. C'est l'anniversaire de ${BIRTH.name} aujourd'hui ! Il a ${BIRTH.age} ans, ca fait un paquet de choco-grenouille.`)
      } else {
        bot.sendMessage('509416027', `Il fait actuellement ${weather.temp}°C. Mais attention, il fera minimum ${weather.min}°C et maximum ${weather.max}°C. Bonne journée :) `);
      }
      
    } else {
      bot.sendMessage('509416027', `Bravo.. Bravo ! Je n'ai pas regardé la météo..`);
    }
}, null, true, 'Europe/Brussels')


sendWeather.start()


bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

