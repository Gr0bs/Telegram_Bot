import TelegramBot  from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import moment from 'moment'
import fetch from 'node-fetch'
dotenv.config()

const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

setInterval(async () => {
  let weather = {
    temp: null,
    min: null,
    max: null
  }
  const HOUR = moment().local(true).format('HH:mm')
  // bot.on('message', (msg) => {
  //   const chatId = msg.chat.id;
  if(HOUR === '21:18'){
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
      bot.sendMessage('509416027', `Il fait actuellement ${weather.temp}°C. Mais attention, il fera minimum ${weather.min}°C et maximum ${weather.max}°C. Bonne journée :) `);
      console.log(moment().local(true).format("HH:mm"))
    } else {
      bot.sendMessage('509416027', `Bravo.. Bravo ! Je n'ai pas regardé la météo..`);
    }
  }
},3000)
// 3600000