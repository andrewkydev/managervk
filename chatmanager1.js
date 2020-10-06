const {VK, Keyboard} = require('vk-io');
const vk = new VK();
const {updates} = vk;
const { upload } = vk;
const fs = require("fs");
const child = require('child_process');
const { MessageContext } = require('vk-io');
const http = require('https');
const requests = require('request')
const path = require('path')

// ------------------------------------------------------------ \\

const acc = require("./base/acc.json");
const uid = require("./base/uid.json");
const chats = require("./chat/chats.json");

// ------------------------------------------------------------ \\
setInterval(function(){
  fs.writeFileSync("./base/acc.json", JSON.stringify(acc, null, "\t"));
  fs.writeFileSync("./base/uid.json", JSON.stringify(uid, null, "\t"));
  fs.writeFileSync("./chat/chats.json", JSON.stringify(chats, null, "\t"));
}, 1000);

// Backup base

setInterval(function(){
     fs.appendFileSync("./chat/backup.txt", `${chats}`);
}, 120000);
// ------------------------------------------------------------ \\


let user = new VK();
user.setOptions({
  token: '6802f764cbc787a204a8b1d537eb71e05417d1c9c286bbe2b5426b17a9adf597255428652eb8a7cb82edf'
});

vk.setOptions({
    token: 'c303d362ebfb7819e428cc4179a7370935c3381f74130cf219a68185786cc653dc723d2981c724a9e3ea1',
    apiMode: 'parallel',
  pollingGroupId: 193015868
});
// ------------------------------------------------------------ \\

vk.updates.on(['chat_invite_user_by_link'], async (message, next) => {
     let count = 0;
         let user = await vk.api.users.get({user_id: message.payload.action.member_id})

     count += 1;

    if(count == 1){
    text += `@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}), `

    return message.send(`${text}${chats[message.chatId].motd}`)
    }

    if(count < 2){
     text += `@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}), `

    return message.send(`${text}${chats[message.chatId].motd}`)
   }

          if(chats[message.chatId].users[message.senderId].isBanned && chats[message.chatId].users[message.payload.action.member_id].permanently){

        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: message.senderId});
        return message.send(`@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}) - находится в бане`+(m.tban < 1 ? `.` : `, до разбана ${timer(chats[message.chatId].users[message.payload.action.member_id].tban)}`)+``);
}

    await next();
  });

 vk.updates.on(['chat_invite_user'], async (message, next) => {
    if(message.payload.action.member_id > 0){

   if(chats[message.chatId].settings.invite == false){
    let user = await vk.api.users.get({user_id: message.payload.action.member_id})

    vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.payload.action.member_id })

    message.send(`@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}), исключен.\nАдминистратор запретил приглашать в беседу.`)
    vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
   }

   if(chats[message.chatId].settings.invite == true){
    let count = 0;
    let text = ``;
   let user = await vk.api.users.get({user_id: message.payload.action.member_id})
  count += 1;

    if(count == 1){
    text += `@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}), `

    return message.send(`${text}${chats[message.chatId].motd}`)
    }

    if(count < 2){
     text += `@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}), `

    return message.send(`${text}${chats[message.chatId].motd}`)
   }

    if(chats[message.chatId].users[message.payload.action.member_id].isBanned && chats[message.chatId].users[message.payload.action.member_id].permanently){

        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: message.payload.action.member_id });
        return message.send(`@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}) - находится в бане`+(chats[message.chatId].tban < 1 ? `.` : `, до разбана ${timer(chats[message.chatId].users[message.payload.action.member_id].tban)}`)+``);}
    }
  }

    if(message.payload.action.member_id < 0){

     if(chats[message.chatId].settings.protectgroup1 == false){
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.payload.action.member_id })
      message.send(`[SYSTEM] => PROTECTION GROUP: INCLUDED\n&#8195;[SUCCESS] => THE GROUP WAS DELETED`)
     }

    if(chats[message.chatId].settings.protectgroup1 == false){
      vk.api.groups.getById({ group_ids: message.payload.action.member_id, fields: "city,country,place,description,wiki_page,market,members_count,counters,start_date,finish_date,can_post,can_see_all_posts,activity,status" }).then(function(response){
      let c = response[0];
      if(!chats[message.chatId].groups[message.payload.action.member_id]){
         chats[message.chatId].groups[message.payload.action.member_id] = {
           id: "-"+ message.payload.action.member_id,
           name: c.name,
           sname: c.screen_name,
           msg: 0,
           symbols: 0,
           warns: 0,
           timeban: 0,
           ban: false,
           permban: false
         }

      }

      message.send(`В конференцию была добавлена группа: @id${c.id} (${c.name})\n[Подписчики] => ${c.members_count}\n[Статус] => ${c.description}`)
      })
     }

    }

    await next();

  });

vk.updates.on(['chat_invite_user'], async (message, next) => {
    if(message.payload.action.member_id > 0){

   if(chats[message.chatId].settings.invite == false){
    let user = await vk.api.users.get({user_id: message.payload.action.member_id})

    vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.payload.action.member_id })

    message.send(`@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}), исключен.\nАдминистратор запретил приглашать в беседу.`)
    vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
   }

   if(chats[message.chatId].settings.invite == true){
    let count = 0;
    let text = ``;
   let user = await vk.api.users.get({user_id: message.payload.action.member_id})
  count += 1;

    if(count == 1){
    text += `@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}), `

    return message.send(`${text}${chats[message.chatId].motd}`)
    }

    if(count < 2){
     text += `@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}), `

    return message.send(`${text}${chats[message.chatId].motd}`)
   }

    if(chats[message.chatId].users[message.payload.action.member_id].isBanned && chats[message.chatId].users[message.payload.action.member_id].permanently){

        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: message.payload.action.member_id });
        return message.send(`@id${message.payload.action.member_id} (${user[0].first_name} ${user[0].last_name}) - находится в бане`+(chats[message.chatId].tban < 1 ? `.` : `, до разбана ${timer(chats[message.chatId].users[message.payload.action.member_id].tban)}`)+``);}
    }
  }

    if(message.payload.action.member_id < 0){

     if(chats[message.chatId].settings.protectgroup1 == true){
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.payload.action.member_id })
      message.send(`Включён запрет на приглашение групп.`)
     }

    if(chats[message.chatId].settings.protectgroup1 == false){

      let group = await vk.api.groups.getById({ group_id: Math.abs(message.payload.action.member_id), fields: "city,country,place,description,wiki_page,market,members_count,counters,start_date,finish_date,can_post,can_see_all_posts,activity,status" })

        if(!chats[message.chatId].groups[message.payload.action.member_id]){
               chats[message.chatId].groups[message.payload.action.member_id] = {
                  id: Math.abs(message.payload.action.member_id) ,
                  name: group[0].name,
                  sname: group[0].screen_name,
                  msg: 0,
                  warns: 0,
                  ban: false,
                  permban: false
              }
          }

       message.send(`В чат добавлена группа: @${group[0].screen_name} (${group[0].name})\n[Подписчики] => ${group[0].members_count}\n[Статус] => ${group[0].description}`)

     }
    }

    await next();

  });

   vk.updates.on(['chat_kick_user'], async (message, next) => {
let [user_info] = await vk.api.users.get({user_id: message.payload.action.member_id})

if(message.payload.action.member_id == message.senderId) {
if(chats[message.chatId].users[message.payload.action.member_id].group == 0){
if(chats[message.chatId].settings.kick_leave == true){
message.send(`[SYSTEM] » Пользователь @id${message.payload.action.member_id} (${user_info.first_name} ${user_info.last_name}) покинул беседу и был исключён `);
vk.api.call('messages.removeChatUser', { chat_id: message.chatId, user_id: message.payload.action.member_id })
chats[message.chatId].users[message.senderId].group = 0
}
if( chats[message.chatId].settings.kick_leave == false){
chats[message.chatId].users[message.senderId].leave = true
chats[message.chatId].users[message.senderId].group = 0
message.send(`[🔰] » Пользователь @id${message.payload.action.member_id} (${user_info.first_name} ${user_info.last_name}) покинул беседу`);
}
} else {

chats[message.chatId].users[message.senderId].leave = true
chats[message.chatId].users[message.senderId].group = 0
message.send(`[🔰] » Пользователь @id${message.payload.action.member_id} (${user_info.first_name} ${user_info.last_name}) покинул беседу`);
}
}

await next();
});

vk.updates.on(['chat_title_update'], async (message, next) => {

let user = await vk.api.users.get({user_id: message.payload.action.member_id})

 if(chats[message.chatId].users[message.senderId].group == 0){
   message.send(`[❌] » @id${message.payload.action.member_id} (Пользователь), ваш уровень Админ Прав маленький для смены название беседы `);
  vk.api.call('messages.editChat', { chat_id: message.chatId, title: chats[message.chatId].title })
}
      await next();
      });

vk.updates.use(async (message, next) => {
    if (message.is("message") && message.isOutbox)
        return;

    message.user = message.senderId;
    message.text = message.payload.text;

   if(chats[message.chatId]){ m = chats[message.chatId].users[message.user]; }

  if(Number(message.senderId) <= 0) return;
  if(/\[club193015868\|(.*)\]/i.test(message.text)) message.text = message.text.replace(/\[club193015868\|(.*)\]/ig, '').trim();

if(chats[message.chatId]){
 if(chats[message.chatId].users[message.user]){
   message.attachments.map(function(a) {
    if (a.type == 'photo') {
        chats[message.chatId].photos += 1
        m.stats.photos += 1
    } else if (a.type == 'sticker') {
        chats[message.chatId].stikers += 1
        m.stats.stikers += 1
    } else if (a.type == 'video') {
        chats[message.chatId].videos += 1
        m.stats.videos += 1
    } else if (a.type == 'audio') {
        chats[message.chatId].audios += 1
        m.stats.audios += 1
    } else if (a.type == 'wall') {
        chats[message.chatId].wall_posts += 1
        m.stats.wall_posts += 1
    } else if (a.type == 'doc') {
        chats[message.chatId].documents += 1
       m.stats.documents += 1
    } else if (a.type == 'audio_message') {
        chats[message.chatId].audio_messages += 1
       m.stats.audio_messages += 1
    }
});
 }
}

if(!message.text) return;
   if(!chats[message.chatId]) {
    chats[message.chatId] = {
           activate: false,
            motd: "",
            name: 0,
            flood: 0,
            prefix: "/",
            banlength: 0,
            owner: 0,
            owname: ``,
            tex: false,
            count: 0,
            smilemsg: 0,
            commsg: 0,
            matmsg: 0,
            symbols: 0,
            forwarded_messages: 0,
            photos: 0,
            videos: 0,
            audios: 0,
            stikers: 0,
            wall_posts: 0,
            documents: 0,
            audio_messages: 0,
            dostup: {
              warn: 1,
              unwarn: 1,
              ban: 3,
              unban: 3,
              permban: 4,
              kick: 2,
              prefix: 3,
              event: 3,
              setrules: 3,
              helper: 4,
              admin: 3,
              moder: 3,
              user: 3,
              tex: 3,
              detail: 2,
              chatcfg: 3,
              symbols: 3,
              warns: 3,
              tempban: 3,
              motd: 3
            },
            bgold: false,
            setting: {
             symbols: 800,
             warns: 3
            },
            settings: {
              url: false,
              invite: true,
              kick_leave: false,
              mute: false,
              protectgroup1: false
            },
       rules: "Правила не установлены",
       title: "none",
            key: `${randomUid()}`,
         banned: [],
           lastname: {},
         groups: {},
         groups2: [],
           invites: {},
           names: [],
         users: {}
    }
    chats[message.chatId].motd = "Добро пожаловать в беседу, чтобы узнать правила, напишите "+ chats[message.chatId].prefix +"rules";
  }


vk.api.messages.getConversationMembers({ peer_id: message.peerId, fields: "id", group_id: 193015868 }).then(function(response){
let c = response;
c.items.map(function(c){
if(c.member_id < 1) return;
 vk.api.call('users.get', {
  user_ids: c.member_id,
  fields: "photo_max,city,verified,status,domain,photo_id,sex,last_seen,first_name"
    }).then(res => {
     let user = res[0];
     if(!chats[message.chatId].users[c.member_id]){
        chats[message.chatId].users[c.member_id] = {
                  id: c.member_id,
                  name: `${user.first_name} ${user.last_name}`,
                  warns: 0,
                  active: 0,
                  uinvite: 0,
                  uchat: true,
                  chatdata: `${data()}`,
                  leave: false,
                  top: false,
                   stats: {
                     msg: 0,
                     smilemsg: 0,
                     commsg: 0,
                     matmsg: 0,
                     symbols: 0,
                     forwarded_messages: 0,
                     photos: 0,
                     videos: 0,
                     audios: 0,
                     stikers: 0,
                     wall_posts: 0,
                     documents: 0,
                     audio_messages: 0
                  },
                  tban: 0,
                  ban: false,
                  isBanned: false,
                  permanently: false,
                  group: 0
           }
       }

    if(!uid[c.member_id]){
    acc.number += 1;
    let numm = acc.number;
    uid[c.member_id] = {
      id: numm
    }

    acc.users[numm] = {
      number: numm,
      id: c.member_id,
      prefix: `${user.first_name} ${user.last_name}`,
      msg: 0,
      smilemsg: 0,
      matmsg: 0,
      commsg: 0,
      last_msg: false,
            ban: false,
      rtime: `${time()} | ${data()}`
      }
  }

})
})
}).catch((error) => {
 message.send(`
[⛔] Ошибка #404
[⚠] Чтобы мой функционал заработал, нужно выдать мне Ст.модера в беседе.
`)
});

vk.api.messages.getConversationMembers({ peer_id: message.peerId, fields: "id", group_id: 193015868 }).then(function(response){
let c = response;
c.groups.map(function(c){
  if(!chats[message.chatId].groups[-c.id]){
  chats[message.chatId].groups[-c.id] = {
    id: c.id,
    name: c.name,
    sname: c.screen_name,
    msg: 0,
    warns: 0,
    ban: false,
    permban: false
  }
}
})
})

vk.api.messages.getConversationMembers({ peer_id: message.peerId, fields: "id", group_id: 193015868 }).then(function(response){
let c = response;
c.items.map(function(c){
 if(c.member_id < 1) return;
 if(c.is_owner == true) return;
  if(!chats[message.chatId].invites[c.member_id]){
  chats[message.chatId].invites[c.member_id] = { invite: c.invited_by }
}
})
})

vk.api.messages.getConversationMembers({ peer_id: message.peerId, fields: "id", group_id: 193015868 }).then(function(response){
let c = response;
c.items.map(function(c){
 if(c.member_id < 1) return;
 if (c.is_admin == true) {
 chats[message.chatId].users[c.member_id].group = 3
}
if (c.is_owner == true) {
   chats[message.chatId].owner = c.member_id
   vk.api.call('users.get', {
  user_ids: chats[message.chatId].owner,
  fields: "photo_max,city,verified,status,domain,photo_id,sex,last_seen,first_name"
    }).then(res => {
      chats[message.chatId].owname = `${res[0].first_name} ${res[0].last_name}`
   })
     chats[message.chatId].users[c.member_id].group = 4
    chats[message.chatId].groups2.push({ group: 3 })
    }
})
})

vk.api.messages.getConversationsById({ peer_ids: message.peerId, extended: 0, group_id: 193015868 }).then(function(response){
let c = response;
c.items.map(function(c){
 chats[message.chatId].title = `${c.chat_settings.title}`
})
})

 if(Number(message.senderId) <= 0){
    if(chats[message.chatId].setting.symbols <= message.text.length) {
      m.warns += 1;
     if(chats[message.chatId].users[message.user].warns >= chats[message.chatId].setting.warns) {
       m.reason = "Превышен лимит символов";
       m.isBanned = true;
       m.warns = 0;
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
   }
  message.send(`[❌] » Вы привысили лимит символов [${chats[message.chatId].setting.symbols}]\n[⚠] » Теперь у вас [${chats[message.chatId].users[message.user].warns}/${chats[message.chatId].setting.warns}] предупреждений`)
  }

  chats[message.chatId].groups[message.senderId].msg += 1;
 }

if(m.group == 0){
if(chats[message.chatId].settings.mute == true){

var smiles = message.text.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g)
    if(smiles != null) {
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
  }

message.attachments.map(function(a) {
    if (a.type == 'photo') {
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'sticker') {
        vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'video') {
        vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'audio') {
       vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'wall') {
        vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'doc') {
       vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'audio_message') {
    vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    }
});
 vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
message.send(`@id${message.user} (${m.name}), нарушил режим тишины и был исключен`);
}
}

if(m.group == 1){
if(chats[message.chatId].settings.mute == true){

    var smiles = message.text.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g)
    if(smiles != null) {
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

  }

    message.attachments.map(function(a) {
    if (a.type == 'photo') {
     vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'sticker') {
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'video') {
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'audio') {
     vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'wall') {
    vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'doc') {
   vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    } else if (a.type == 'audio_message') {
    vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })

    }
});
 vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
message.send(`@id${message.user} (${m.name}), нарушил режим тишины и был исключен`);
}
}

if(m.group == 0){

if(chats[message.chatId].setting.symbols <= message.text.length){
m.warns += 1;
if(m.warns >= chats[message.chatId].setting.warns) {
 m.reason = "Превышен лимит символов";
 m.isBanned = true;
  m.warns = 0;
  vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
}
 message.send(`[❌] » Вы привысили лимит символов [${chats[message.chatId].setting.symbols}]\n[⚠] » Теперь у вас [${chats[message.chatId].users[message.user].warns}/${chats[message.chatId].setting.warns}] предупреждений`)
}
}

if(m.group == 1){

if(chats[message.chatId].setting.symbols <= message.text.length) {
m.warns += 1;
if(chats[message.chatId].users[message.user].warns >= chats[message.chatId].setting.warns) {
  m.reason = "Превышен лимит символов";
 m.isBanned = true;
  m.warns = 0;
  vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
}
 message.send(`[❌] » Вы привысили лимит символов [${chats[message.chatId].setting.symbols}]\n[⚠] » Теперь у вас [${chats[message.chatId].users[message.user].warns}/${chats[message.chatId].setting.warns}] предупреждений`)
}
}

   acc.msg += 1;
   chats[message.chatId].flood += 1;
   m.stats.msg += 1;
   m.active = 0;
   chats[message.chatId].symbols += message.text.length;
   m.stats.symbols += message.text.length;


var smiles = message.text.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g)
    if(smiles != null) {
      chats[message.chatId].smilemsg += smiles.length
      m.stats.smiles += smiles.length
  }

  if(message.text){
    if(!m) return;
  }
      if(m.ban != false) return;
    try {
        await next();
    } catch (err) { console.error(err) }
});

// ------------------------------------------------------------ \\
updates.hear(/^(?:беседы)$/i, (message) => {
let text = ``;
 if(message.user !== 498281739) return;
 for(a in chats){
 text += `
[📗] » ID беседы: ${a}
`
}
message.send(`${text}`);
});

updates.hear(/^(?:!|czz|ceval|cdev|csystem code)\s([^]+)$/i, (message) => {
    let user = acc.users[user_id(message.user)];
        if(message.user !== 498281739) return;

  try {
    const result = eval(message.$match[1]);

    if(typeof(result) === 'string')
    {
      return message.send(`@id${user.id} (${m.name}), string: ${result}`);
    } else if(typeof(result) === 'number')
    {
      return message.send(`@id${user.id} (${m.name}), number: ${result}`);
    } else {
      return message.send(`@id${user.id} (${m.name}), ${typeof(result)}: ${JSON.stringify(result, null, '&#12288;\t')}`);
    }
  } catch (e) {
    console.error(e);
    return message.send(`@id${user.id} (${m.name}), ошибка:
    ${e.toString()}`);
  }

});

updates.hear(/^(?:Новости|cnews|навасти|Новасти|call)\s?([^]+)?$/i, (message) => {
    let user = acc.users[user_id(message.user)];
        if(message.user !== 498281739) return;
       for(a in chats){
        vk.api.call('messages.send', { chat_id: a, random_id: 0, message: `${message.$match[1]}` })
     }
     vk.api.call('messages.send', { user_id: 498281739, random_id: 0, message: `[✔] » Рассылка прошла успешно` })
});
//-------------------------------------------------------------------------------\\

updates.hear(/^(.)(?:неактивные|не активные|неактивных|нетактивных|нет активных|noactive|no active)$/i, (message) => {
 let text = ``;
 let id = message.chatId;
 let chat = chats[id];
 if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
   if(chat.bgold == false) return message.send(`Для данной функции нужен. Тип беседы: Золотой`);
     if(m.group < 2) return message.send(`Доступ к данной команде с роли: "Ст.модер"`);

      text += `Список активности:\n\n`
     	for(a in chats[id].users){
     		if(chats[id].users[a]){
     		   if(chats[id].users[a].active <= 10){
     		   	text += `@id${a} (${chats[id].users[a].name}) [${timer(chats[id].users[a].active)}]\n`
     		   }
     		}
     	}
     	message.send(text.slice(0,Math.floor(text.length/2)) )
         message.send(text.slice(Math.floor(text.length/2), text.length))
});

updates.hear(/^(.)(?:chat bot off)$/i, (message) => {
 let chat = chats[message.chatId];
 let a = chat.users[message.user];
if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chat.bgold == false) return message.send(`Доступ с Золотой Беседы `);
if(m.group < chats[message.chatId].dostup.tex) return message.send(`Доступ с ${chats[message.chatId].dostup.tex.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
chat.tex = true;
message.send(`Технический режим включён, чтобы отключить напишите: "chat bot on"`);
})

updates.hear(/^(.)(?:chat bot on)$/i, (message) => {
 let chat = chats[message.chatId];
 let a = chat.users[message.user];
if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chat.bgold == false) return message.send(`Доступ с Золотой Беседы `);
if(m.group < chats[message.chatId].dostup.tex) return message.send(`Доступ с ${chats[message.chatId].dostup.tex.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
if(chat.tex == false) return message.send(`У вас не включён технический режим `);
chat.tex = false;
message.send(`Технический режим отключен, чтобы включить напишите: "chat bot off"`);
})

updates.hear(/^(?:Пользователи|users)$/i, (message) => {
  if(message.user !== 498281739) return;
  let text = ``;
  let count = 0;
  for(a in chats[message.chatId].users){
  count += 1;
   text += `@id${a} (${chats[message.chatId].users[a].name})\n`
  }
  message.send(`${text}\n\nВ итоге: ${count}`)
})

updates.hear(/^(.)(?:чат настройки|чат конфиг|чат кфг|chatcfg|chat cfg)$/i, (message) => {
let id = message.chatId;
  if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
 if(chats[id].bgold == false) return message.send(`Доступ для золотых бесед`);
if(m.group < chats[message.chatId].dostup.chatcfg) return message.send(`Доступ с ${chats[message.chatId].dostup.chatcfg.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
 message.send(`
[➕] » Конфиг чата [${chats[id].title}] « [➕]

[📝] » Префикс: "${chats[id].prefix}"

[🔠] » Максимум символов: [${chats[id].setting.symbols}]
 [❗] » Для смены введите: ${chats[id].prefix}symbol [Количество] {Максимум - 2000}

[⚠] » Максимум предупреждений: [${chats[id].setting.warns}]
 [❗] » Для смены введите: ${chats[id].prefix}warns [Количество] {Максимум - 10}
`);
})

updates.hear(/^(.)(?:fd|full)\s?([0-9]+)$/i, (message) => {
  if(message.user !== 498281739) return;
  let id = message.chatId;
  chats[id].users[message.user].group = message.$match[2]
  message.send(`@id498281739 (Создатель проекта), вы успешно выдали себе роль: ${m.group.toString().replace(/0/gi, "Пользователь").replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Helper").replace(/4/gi, "Создатель беседы")} в чате "${chats[id].title}"`)
})

updates.hear(/^(.)(?:symbols|symbol|символ|символы)\s?([0-9]+)?$/i, (message) => {
let id = message.chatId;
  if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
if(chats[id].bgold == false) return message.send(`Доступ для золотых бесед`);
 if(m.group < chats[message.chatId].dostup.symbols) return message.send(`Доступ с ${chats[message.chatId].dostup.symbols.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
 if(message.$match[2] >= 2001) return message.send(`Максимально можно поставить 2000 символов `);
if(message.$match[2] < 1) return message.send(`Максимально можно поставить 1 символ`)
 chats[message.chatId].setting.symbols = message.$match[2]
 message.send(`[✔] » Установка символов прошла успешно \n [🔠] » Теперь в чате доступно [${message.$match[2]}] символов`);
})

updates.hear(/^(.)(?:warns|setwarns|warnsset|addwarns|addwarns)\s?([0-9]+)?$/i, (message) => {
let id = message.chatId;
  if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
if(chats[id].bgold == false) return message.send(`Доступ для золотых бесед`);
 if(m.group < chats[message.chatId].dostup.warns) return message.send(`Доступ с ${chats[message.chatId].dostup.warns.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
 if(message.$match[2] >= 13) return message.send(`Максимально можно поставить 12 предупреждений `);
 if(message.$match[2] < 1) return message.send(`Максимально можно поставить 1 предупреждение `);
 chats[message.chatId].setting.warns = message.$match[2]
 message.send(`[✔] » Установка предупреждений прошла успешно \n [⚠] » Теперь в чате доступно [${message.$match[2]}] предупреждений `);
})

updates.hear(/^(.)(?:manager|помощь|help)$/i, (message) => {
let id = message.chatId;
  if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
return message.send(`[🛡] || Менеджер:

[🔰] » Обычные команды:
  [👕] » ${chats[id].prefix}Моястата - Ваша статистика.
  [📗] » ${chats[id].prefix}Статистика - Статистика беседы.
  [💻] » ${chats[id].prefix}Staff - Администрация беседы.`+(m.group < 1 ? `` : `\n\n
[👑] » Для золотых бесед:
  [📜] » [${chats[message.chatId].dostup.event.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}events - Список событий.
  [✔] » [${chats[message.chatId].dostup.tex.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}chat bot on - включить менеджера .
  [❌] » [${chats[message.chatId].dostup.tex.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}chat bot of - выключить менеджера.
  [📗] » [${chats[message.chatId].dostup.event.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}prefix - сменить префикс.
  [💣] » [${chats[message.chatId].dostup.chatcfg.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}chatcfg - конфинг чата.

[➕] » Команды для Администрации:
  [1] » [${chats[message.chatId].dostup.warn.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}warn [ссылка] - выдать предупреждение.
  [2] » [${chats[message.chatId].dostup.warn.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}unwarn [ссылка] - снять предупреждение.
  [3] » [${chats[message.chatId].dostup.ban.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}detail [ссылка] - посмотреть пользователя.
  [4] » [${chats[message.chatId].dostup.setrules.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}setrules [Text] - Установить правила.
  [5] » [${chats[message.chatId].dostup.user.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}user [ссылка] - Забрать роль.
  [6] » [${chats[message.chatId].dostup.moder.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}moder [ссылка] - Выдать модератора.
  [7] » [${chats[message.chatId].dostup.admin.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}st.moder [ссылка] - Выдать ст.Модера.
  [8] » [${chats[message.chatId].dostup.helper.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}helper [ссылка] - Выдать Администратора.
  [9] » [${chats[message.chatId].dostup.ban.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}ban [ссылка] - Заблокировать пользователя.
  [10] » [${chats[message.chatId].dostup.tempban.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}tempban [ссылка] [время] [минута|час|день]
  [11] » [${chats[message.chatId].dostup.unban.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}unban [Ссылка] - Разблокировать пользователя.
  [12] » [${chats[message.chatId].dostup.permban.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[id].prefix}permban [Ссылка] - Заблокировать навсегда.
  [13] » [👑] ${chats[id].prefix}доступы - Посмотреть/Сменить доступы. (не доступно)
  [14] » [${chats[message.chatId].dostup.motd.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[message.chatId].prefix}motd [Приветствие].
  [15] » [${chats[message.chatId].dostup.kick.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[message.chatId].prefix}kick [ссылка] - исключить пользователя.
  [16] » [${chats[message.chatId].dostup.detail.toString().replace(/1/gi, "👮‍♂").replace(/2/gi, "🕵‍♂").replace(/3/gi, "🤵").replace(/4/gi, "👑")}] ${chats[message.chatId].prefix}detail [ссылка] - инфа о юзере.

[❗] Каждый смайл возле команды, это уровень доступа.
&#8195;👮‍♂ - Модератор
&#8195;🕵‍♂ - Ст.модер
&#8195;🤵 - Администратор
&#8195;👑 - Создатель беседы
  `)+`
`);
});


updates.hear(/^(.)(?:Доступы|Dostups)$/i, (message) => {
if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
let id = message.chatId;
let a = chats[id].users[message.user];
if(m.group < 4) return message.send(`Доступ только у Создателя.`)
return message.send(`
[♻] » Список доступов:
&#8195;[1] » ${chats[message.chatId].prefix}warn [${chats[message.chatId].dostup.warn.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[2] » ${chats[message.chatId].prefix}unwarn [${chats[message.chatId].dostup.warn.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[3] » ${chats[message.chatId].prefix}ban [${chats[message.chatId].dostup.ban.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[4] » ${chats[message.chatId].prefix}unban [${chats[message.chatId].dostup.unban.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[5] » ${chats[message.chatId].prefix}permban [${chats[message.chatId].dostup.permban.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[6] » ${chats[message.chatId].prefix}kick [${chats[message.chatId].dostup.kick.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[7] » ${chats[message.chatId].prefix}prefix [${chats[message.chatId].dostup.event.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[8] » ${chats[message.chatId].prefix}event [${chats[message.chatId].dostup.event.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[9] » ${chats[message.chatId].prefix}setrules [${chats[message.chatId].dostup.setrules.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[10] » ${chats[message.chatId].prefix}helper [${chats[message.chatId].dostup.helper.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[11] » ${chats[message.chatId].prefix}admin [${chats[message.chatId].dostup.admin.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[12] » ${chats[message.chatId].prefix}moder [${chats[message.chatId].dostup.moder.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[13] » ${chats[message.chatId].prefix}user [${chats[message.chatId].dostup.user.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[14] » ${chats[message.chatId].prefix}chat bot off/on [${chats[message.chatId].dostup.tex.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[15] » ${chats[message.chatId].prefix}detail [${chats[message.chatId].dostup.detail.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[16] » ${chats[message.chatId].prefix}chatcfg [${chats[message.chatId].dostup.chatcfg.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[17] » ${chats[message.chatId].prefix}symbols [${chats[message.chatId].dostup.symbols.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[18] » ${chats[message.chatId].prefix}warns [${chats[message.chatId].dostup.warns.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[19] » ${chats[message.chatId].prefix}tempban [${chats[message.chatId].dostup.tempban.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]
&#8195;[20] » ${chats[message.chatId].prefix}motd [${chats[message.chatId].dostup.motd.toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}]

[❗] » Чтобы настроить доступ команде, пиши: "Доступ [Цифра доступа] [Цифра статуса]"
[⚠] » Что за цифра возле команды? Если чо это нужно для смена доступа :/
`)
})

updates.hear(/^(.)(?:Доступ|Установить доступ|dostup|setdostup)\s?([0-9]+)\s?([0-9])?$/i, (message) => {
if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
let id = message.chatId;
let a = chats[id].users[message.user];
if(m.group < 4) return message.send(`Доступ только у Создателя.`)

if(/(?:1)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.warn) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.warn = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:2)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.unwarn) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.unwarn = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:3)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.ban) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.ban = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:4)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.unban) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.unban = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:5)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.permban) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.permban = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:6)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.kick) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.kick = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:7)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.prefix) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.prefix = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:8)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.event) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.event = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:9)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.setrules) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.setrules = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:10)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.helper) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.helper = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:11)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.admin) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.admin = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:12)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.moder) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.moder = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:13)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.user) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.user = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:14)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.tex) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.tex = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:15)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.detail) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.detail = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:16)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.chatcfg) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.chatcfg = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:17)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.symbols) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.symbols = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:18)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.warns) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.warns = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
if(/(?:18)/i.test(message.$match[2])) {
 if(message.$match[1] == chats[message.chatId].dostup.tempban) return message.send(`[Ошибка] У данной привилегии, установлен данный статус.`)
 chats[message.chatId].dostup.tempban = message.$match[3]
 return message.send(`Вы установили данной команде, доступ с ${message.$match[3].toString().replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Администратор").replace(/4/gi, "Создатель")}`)
}
});

updates.hear(/^(.)(?:setmotd|motd|мотд|приветствие)\s?([^]+)?$/i, (message) => {
 if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
   if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
  let chat = chats[message.chatId];
  let user = chat.users[message.user];
  if(user.group < chat.dostup.motd) return  message.send(`Доступ с ${chats[message.chatId].dostup.motd.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
  chats[message.chatId].motd = message.$match[1];
  return message.send(`Новое приветствие успешно установлено.`)
});

updates.hear(/^(.)(?:проверка|test|тест|check|включить бота)$/i, (message) => {
let text = ``;
if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
   if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
 if(chats[message.chatId].owner == 0) return message.send(`[❌] » Произошла ошибка!!!\n  [🚫] » Доступ к функционалу не имеется `)
message.send(`[✔] » Бот включен\n  [✔] » Доступ к функционалу имеется `)
});

updates.hear(/^(.)(?:prefix|префикс)\s?(.)?$/i, (message) => {
let chat = chats[message.chatId];
if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
 if(chat.bgold == false) return message.send(`Доступ для золотых бесед`);
if(m.group < chats[message.chatId].dostup.prefix) return message.send(`Доступ с ${chats[message.chatId].dostup.prefix.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
 chat.prefix = message.$match[2]
 message.send(`Теперь все команды доступны с префикса "${message.$match[2]}"`);
});

updates.hear(/^(.)(?:профиль|проф|прф|моястата детально|mystat detail|mystats detail|Моястата|mystat|my stat|my stats)$/i, (message) => {
  let a = acc.users[user_id(message.user)];
       let oid = message.user;
     if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
   if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
  return message.send(`
[👤] » Подробная статистика [@id${message.user} (${m.name})]

&#8195;[👑] » Роль: ${m.group.toString().replace(/0/gi, "Пользователь").replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Helper").replace(/4/gi, "Создатель беседы")}`+(m.group < 4 ? `\n&#8195;[➕] » Пригласил: @id${chats[message.chatId].invites[message.user].invite} (${chats[message.chatId].users[chats[message.chatId].invites[message.user].invite].name})` : ``)+`
&#8195;[📅] » В чате с ${m.chatdata}
&#8195;[⚠] » Предупреждений: ${m.warns}/3
&#8195;[💬] » Сообщений: ${m.stats.msg}
&#8195;[🔠] » Символов: ${chats[message.chatId].users[oid].stats.symbols}
&#8195;[📩] » Пересланных: ${chats[message.chatId].users[oid].stats.forwarded_messages}
&#8195;[📷] » Фото: ${chats[message.chatId].users[oid].stats.photos}
&#8195;[📹] » Видео: ${chats[message.chatId].users[oid].stats.videos}
&#8195;[💩] » Стикеров: ${chats[message.chatId].users[oid].stats.stikers}
&#8195;[😊] » Смайлов: ${chats[message.chatId].users[oid].stats.smilemsg}
&#8195;[👺] » Сообщений с матом: ${chats[message.chatId].users[oid].stats.matmsg}
`)
});


updates.hear(/^(.)(?:detail|get)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
   let chatid = message.chatId;
     if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  if(m.group < chats[message.chatId].dostup.detail) return message.send(`Доступ с ${chats[message.chatId].dostup.detail.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

     if(message.replyMessage){
    let oid = message.replyMessage.senderId;
   return message.send(`
[👤] » Подробная статистика [@id${message.user} (${chats[message.chatId].users[oid].name})]

&#8195;[👑] » Роль: ${chats[message.chatId].users[oid].group.toString().replace(/0/gi, "Пользователь").replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Helper").replace(/4/gi, "Создатель беседы")}
&#8195;[📅] » В чате с ${chats[message.chatId].users[oid].chatdata}
&#8195;[⚠] » Предупреждений: ${chats[message.chatId].users[oid].warns}/3
&#8195;[💬] » Сообщений: ${chats[message.chatId].users[oid].stats.msg}
&#8195;[🔠] » Символов: ${chats[message.chatId].users[oid].stats.symbols}
&#8195;[📩] » Пересланных: ${chats[message.chatId].users[oid].stats.forwarded_messages}
&#8195;[📷] » Фото: ${chats[message.chatId].users[oid].stats.photos}
&#8195;[📹] » Видео: ${chats[message.chatId].users[oid].stats.videos}
&#8195;[💩] » Стикеров: ${chats[message.chatId].users[oid].stats.stikers}
&#8195;[😊] » Смайлов: ${chats[message.chatId].users[oid].stats.smilemsg}
&#8195;[👺] » Сообщений с матом: ${chats[message.chatId].users[oid].stats.matmsg}

&#8195;[⛔] » Блокировка: ${chats[message.chatId].users[oid].isBanned.toString().replace(/true/gi, "True").replace(/false/gi, "False")}`+(chats[message.chatId].users[oid].tban < 1 ? `` : `\n&#8195;[💥] » Разбан через: ${timer(chats[message.chatId].users[oid].tban)}`)+`
`);
    }

      if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let oid = message.forwards[0].senderId;
   return message.send(`
[👤] » Подробная статистика [@id${message.user} (${chats[message.chatId].users[oid].name})]

&#8195;[👑] » Роль: ${chats[message.chatId].users[oid].group.toString().replace(/0/gi, "Пользователь").replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Helper").replace(/4/gi, "Создатель беседы")}
&#8195;[📅] » В чате с ${chats[message.chatId].users[oid].chatdata}
&#8195;[⚠] » Предупреждений: ${chats[message.chatId].users[oid].warns}/3
&#8195;[💬] » Сообщений: ${chats[message.chatId].users[oid].stats.msg}
&#8195;[🔠] » Символов: ${chats[message.chatId].users[oid].stats.symbols}
&#8195;[📩] » Пересланных: ${chats[message.chatId].users[oid].stats.forwarded_messages}
&#8195;[📷] » Фото: ${chats[message.chatId].users[oid].stats.photos}
&#8195;[📹] » Видео: ${chats[message.chatId].users[oid].stats.videos}
&#8195;[💩] » Стикеров: ${chats[message.chatId].users[oid].stats.stikers}
&#8195;[😊] » Смайлов: ${chats[message.chatId].users[oid].stats.smilemsg}
&#8195;[👺] » Сообщений с матом: ${chats[message.chatId].users[oid].stats.matmsg}

&#8195;[⛔] » Блокировка: ${chats[message.chatId].users[oid].isBanned.toString().replace(/true/gi, "True").replace(/false/gi, "False")}`+(chats[message.chatId].users[oid].tban < 1 ? `` : `\n&#8195;[💥] » Разбан через: ${timer(chats[message.chatId].users[oid].tban)}`)+`
`);
    }

   if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
       let oid = res.object_id;
       if(!chats[message.chatId].users[oid]) return message.send(`[Error] » Участник не найден!`);
      return message.send(`
[👤] » Подробная статистика [@id${message.user} (${chats[message.chatId].users[oid].name})]

&#8195;[👑] » Роль: ${chats[message.chatId].users[oid].group.toString().replace(/0/gi, "Пользователь").replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Helper").replace(/4/gi, "Создатель беседы")}
&#8195;[📅] » В чате с ${chats[message.chatId].users[oid].chatdata}
&#8195;[⚠] » Предупреждений: ${chats[message.chatId].users[oid].warns}/3
&#8195;[💬] » Сообщений: ${chats[message.chatId].users[oid].stats.msg}
&#8195;[🔠] » Символов: ${chats[message.chatId].users[oid].stats.symbols}
&#8195;[📩] » Пересланных: ${chats[message.chatId].users[oid].stats.forwarded_messages}
&#8195;[📷] » Фото: ${chats[message.chatId].users[oid].stats.photos}
&#8195;[📹] » Видео: ${chats[message.chatId].users[oid].stats.videos}
&#8195;[💩] » Стикеров: ${chats[message.chatId].users[oid].stats.stikers}
&#8195;[😊] » Смайлов: ${chats[message.chatId].users[oid].stats.smilemsg}
&#8195;[👺] » Сообщений с матом: ${chats[message.chatId].users[oid].stats.matmsg}

&#8195;[⛔] » Блокировка: ${chats[message.chatId].users[oid].isBanned.toString().replace(/true/gi, "True").replace(/false/gi, "False")}`+(chats[message.chatId].users[oid].tban < 1 ? `` : `\n&#8195;[💥] » Разбан через: ${timer(chats[message.chatId].users[oid].tban)}`)+`
`);
    })
  }else{
         let oid = message.$match[4];
     if(!chats[message.chatId].users[oid]) return message.send(`[Error] » Участник не найден!`);
       return message.send(`
[👤] » Подробная статистика [@id${message.user} (${chats[message.chatId].users[oid].name})]

&#8195;[👑] » Роль: ${chats[message.chatId].users[oid].group.toString().replace(/0/gi, "Пользователь").replace(/1/gi, "Модератор").replace(/2/gi, "Ст.модер").replace(/3/gi, "Helper").replace(/4/gi, "Создатель беседы")}
&#8195;[📅] » В чате с ${chats[message.chatId].users[oid].chatdata}
&#8195;[⚠] » Предупреждений: ${chats[message.chatId].users[oid].warns}/3
&#8195;[💬] » Сообщений: ${chats[message.chatId].users[oid].stats.msg}
&#8195;[🔠] » Символов: ${chats[message.chatId].users[oid].stats.symbols}
&#8195;[📩] » Пересланных: ${chats[message.chatId].users[oid].stats.forwarded_messages}
&#8195;[📷] » Фото: ${chats[message.chatId].users[oid].stats.photos}
&#8195;[📹] » Видео: ${chats[message.chatId].users[oid].stats.videos}
&#8195;[💩] » Стикеров: ${chats[message.chatId].users[oid].stats.stikers}
&#8195;[😊] » Смайлов: ${chats[message.chatId].users[oid].stats.smilemsg}
&#8195;[👺] » Сообщений с матом: ${chats[message.chatId].users[oid].stats.matmsg}

&#8195;[⛔] » Блокировка: ${chats[message.chatId].users[oid].isBanned.toString().replace(/true/gi, "True").replace(/false/gi, "False")}`+(chats[message.chatId].users[oid].tban < 1 ? `` : `\n&#8195;[💥] » Разбан через: ${timer(chats[message.chatId].users[oid].tban)}`)+`
`);
}
});

 updates.hear(/^(.)(?:состав|команда|staff|admins|администрация)$/i, (message) => {
    if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
let text = ``;
let sozd, helper, admin, moder;
var text5 = [];
var text4 = [];
var text3 = [];
var text2 = [];
sozd = '\nСоздатель:\n';
helper = '\n\n\nАдминистраторы:\n';
admin = '\n\n\nСт.модеры:\n';
moder = '\n\n\nМодераторы:\n';
for(a in chats[message.chatId].users){
if(chats[message.chatId].users[a].group == 1){
text2.push(` @id${chats[message.chatId].users[a].id} (${chats[message.chatId].users[a].name})`)
}
if(chats[message.chatId].users[a].group == 2){
text3.push(` @id${chats[message.chatId].users[a].id} (${chats[message.chatId].users[a].name})`)
}
if(chats[message.chatId].users[a].group == 3){
text4.push(` @id${chats[message.chatId].users[a].id} (${chats[message.chatId].users[a].name})`)
}
if(chats[message.chatId].users[a].group == 4){
text5.push(` @id${chats[message.chatId].users[a].id} (${chats[message.chatId].users[a].name})`)
}
}

// вывод имени через запятую
var gg3 = text5.map(function(name) {
return name;
});
var gg2 = text4.map(function(name) {
return name;
});
var gg1 = text3.map(function(name) {
return name;
});
var gg = text2.map(function(name) {
return name;
});
// Вывод ролей \\

// Owner
if(!gg3) sozd += ` Пусто`;
sozd += `&#8195;${gg3}`;
text += sozd;
// Helper
if(!gg2) helper += ` Пусто`;
helper += `&#8195;${gg2}`;
text += helper;
// Admin
if(!gg1) admin += ` Пусто`;
admin += `&#8195;${gg1}`;
text += admin;
// Moder
if(!gg) moder += ` Пусто`;
moder += `&#8195;${gg}`;
text += moder;

message.send(`${text}`);
});

 updates.hear(/^(.)(?:стата|статистика|chatstat|chatstats|stats)$/i, (message) => {
   if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);

      let d = message.chatId;
      var tops = []
      for (i in chats[d].users) {
        tops.push({ "user_id": chats[d].users[i].id, "msg_count": chats[d].users[i].stats.msg, "symbols": chats[d].users[i].stats.symbols })
      }
      tops.sort(function (a, b) {
        if (b.msg_count > a.msg_count) return 1
        if (b.msg_count < a.msg_count) return -1
        return 0
      })
      var yo = []
      for (var g = 0; g < tops.length; g++) {
        yo.push({ "user_id": tops[g].user_id, "msg_count": tops[g].msg_count })
      }
      function findStaff(element) {
        if (element.user_id == message.user) {
          return element
        }
      }
      var fac = yo.findIndex(findStaff)
      var fac1 = fac + 1

    return message.send(`
@id${message.user} (${m.name}), Подробная информация:

[🆔] » ID Чата: ${message.chatId}
[📎] » Индефикатор чата: "${chats[message.chatId].key}"
`+(chats[message.chatId].bgold === false ? `[💻] » Тип беседы: Обычный` : `[💻] » Тип Беседы: Золотой`)+ `

[💬] » Сообщений собрано: ${chats[message.chatId].flood}
[🔥] » Использовано смайлов: ${chats[message.chatId].smilemsg}
[👺] » Сообщений с матом: ${chats[message.chatId].matmsg}
[🔣] » Символов:  ${chats[message.chatId].symbols}
[📩] » Пересланных: ${chats[message.chatId].forwarded_messages}
[📷] » Фото: ${chats[message.chatId].photos}
[📹] » Видео: ${chats[message.chatId].videos}
[🎧] » Аудио: ${chats[message.chatId].audios}
[💩] » Стикеров: ${chats[message.chatId].stikers}
[📣] » Постов: ${chats[message.chatId].wall_posts}
[📑] » Документов: ${chats[message.chatId].documents}
[🎵] » Голосовых: ${chats[message.chatId].audio_messages}

[📜] » Название чата: "${chats[message.chatId].title}"
[👑] » Создатель чата: @id${chats[message.chatId].owner} (${chats[message.chatId].owname})

[🏆] » Ваш Рейтинг активности: ${utils.sp(fac1)} место - ${utils.sp(yo[fac].msg_count)} сообщений.
`);
});

 updates.hear(/^(.)(?:Зови|Позови|Вызвать)$/i, (message) => {
  if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
   if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
    if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
 var text = [];
 let text2  = ``;
vk.api.messages.getConversationMembers({
   peer_id: message.peerId,
   fields: "online",
   group_id: 193015868
}).then(function(response){
   let c = response;
    for(a in c.profiles){
     if(c.profiles[a].online == 0){
text.push(` @id${c.profiles[a].id} (&#8195;)`)
      }
    }
    var gg = text.map(function(name) {
      return name;
    });
      text2 += `@id${message.user} (${m.name}), вызывает вас всех:\n\n${gg}`;
})

    /////////////////

   message.send(`Идет вызов....`)
   setTimeout(() =>{
   message.send(`${text2}`)
  }, 4000);
 })

 updates.hear(/^(?:бля|6лядь|6лять|b3ъeб|cock|cunt|e6aль|ebal|eblan|eбaл|eбaть|eбyч|eбать|eбёт|eблантий|fuck|fucker|fucking|xyёв|xyй|xyя|xуе|xуй|xую|zaeb|zaebal|zaebali|zaebat|архипиздрит|ахуел|ахуеть|бздение|бздеть|бздех|бздецы|бздит|бздицы|бздло|бзднуть|бздун|бздунья|бздюха|бздюшка|бздюшко|бля|блябу|блябуду|бляд|бляди|блядина|блядище|блядки|блядовать|блядство|блядун|блядуны|блядунья|блядь|блядюга|блять|вафел|вафлёр|взъебка|взьебка|взьебывать|въеб|въебался|въебенн|въебусь|въебывать|выблядок|выблядыш|выеб|выебать|выебен|выебнулся|выебон|выебываться|выпердеть|высраться|выссаться|вьебен|гавно|гавнюк|гавнючка|гамно|гандон|гнид|гнида|гниды|говенка|говенный|говешка|говназия|говнецо|говнище|говно|говноед|говнолинк|говночист|говнюк|говнюха|говнядина|говняк|говняный|говнять|гондон|доебываться|долбоеб|долбоёб|долбоящер|дота|дрисня|дрист|дристануть|дристать|дристун|дристуха|дрочелло|дрочена|дрочила|дрочилка|дрочистый|дрочить|дрочка|дрочун|е6ал|е6ут|еб твою мать|ёб твою мать|ёбaн|ебaть|ебyч|ебал|ебало|ебальник|ебан|ебанамать|ебанат|ебаная|ёбаная|ебанический|ебанный|ебанныйврот|ебаное|ебануть|ебануться|ёбаную|ебаный|ебанько|ебарь|ебат|ёбат|ебатория|ебать|ебать-копать|ебаться|ебашить|ебёна|ебет|ебёт|ебец|ебик|ебин|ебись|ебическая|ебки|ебла|еблан|ебливый|еблище|ебло|еблысть|ебля|ёбн|ебнуть|ебнуться|ебня|ебошить|ебская|ебский|ебтвоюмать|ебун|ебут|ебуч|ебуче|ебучее|ебучий|ебучим|ебущ|ебырь|елда|елдак|елдачить|жопа|жопу|заговнять|задрачивать|задристать|задрота|зае6|заё6|заеб|заёб|заеба|заебал|заебанец|заебастая|заебастый|заебать|заебаться|заебашить|заебистое|заёбистое|заебистые|заёбистые|заебистый|заёбистый|заебись|заебошить|заебываться|залуп|залупа|залупаться|залупить|залупиться|замудохаться|запиздячить|засерать|засерун|засеря|засирать|засрун|захуячить|заябестая|злоеб|злоебучая|злоебучее|злоебучий|ибанамат|ибонех|изговнять|изговняться|изъебнуться|ипать|ипаться|ипаццо|какдвапальцаобоссать|конча|курва|курвятник|лох|лошарa|лошара|лошары|лошок|лярва|малафья|манда|мандавошек|мандавошка|мандавошки|мандей|мандень|мандеть|мандища|мандой|манду|мандюк|минет|минетчик|минетчица|млять|мокрощелка|мокрощёлка|мразь|мудak|мудaк|мудаг|мудак|муде|мудель|мудеть|муди|мудил|мудила|мудистый|мудня|мудоеб|мудозвон|мудоклюй|на хер|на хуй|набздел|набздеть|наговнять|надристать|надрочить|наебать|наебет|наебнуть|наебнуться|наебывать|напиздел|напиздели|напиздело|напиздили|насрать|настопиздить|нахер|нахрен|нахуй|нахуйник|не ебет|не ебёт|невротебучий|невъебенно|нехира|нехрен|нехуй|нехуйственно|ниибацо|ниипацца|ниипаццо|ниипет|никуя|нихера|нихуя|обдристаться|обосранец|обосрать|обосцать|обосцаться|обсирать|объебос|обьебать|обьебос|однохуйственно|опездал|опизде|опизденивающе|остоебенить|остопиздеть|отмудохать|отпиздить|отпиздячить|отпороть|отъебись|охуевательский|охуевать|охуевающий|охуел|охуенно|охуеньчик|охуеть|охуительно|охуительный|охуяньчик|охуячивать|охуячить|очкун|падла|падонки|падонок|паскуда|педерас|педик|педрик|педрила|педрилло|педрило|педрилы|пездень|пездит|пездишь|пездо|пездят|пердануть|пердеж|пердение|пердеть|пердильник|перднуть|пёрднуть|пердун|пердунец|пердунина|пердунья|пердуха|пердь|переёбок|пернуть|пёрнуть|пи3д|пи3де|пи3ду|пиzдец|пидар|пидарaс|пидарас|пидарасы|пидары|пидор|пидорасы|пидорка|пидорок|пидоры|пидрас|пизда|пиздануть|пиздануться|пиздарваньчик|пиздато|пиздатое|пиздатый|пизденка|пизденыш|пиздёныш|пиздеть|пиздец|пиздит|пиздить|пиздиться|пиздишь|пиздища|пиздище|пиздобол|пиздоболы|пиздобратия|пиздоватая|пиздоватый|пиздолиз|пиздонутые|пиздорванец|пиздорванка|пиздострадатель|пизду|пиздуй|пиздун|пиздунья|пизды|пиздюга|пиздюк|пиздюлина|пиздюля|пиздят|пиздячить|писбшки|писька|писькострадатель|писюн|писюшка|по хуй|по хую|подговнять|подонки|подонок|подъебнуть|подъебнуться|поебать|поебень|поёбываает|поскуда|посрать|потаскуха|потаскушка|похер|похерил|похерила|похерили|похеру|похрен|похрену|похуй|похуист|похуистка|похую|придурок|приебаться|припиздень|припизднутый|припиздюлина|пробзделся|проблядь|проеб|проебанка|проебать|промандеть|промудеть|пропизделся|пропиздеть|пропиздячить|раздолбай|разхуячить|разъеб|разъеба|разъебай|разъебать|распиздай|распиздеться|распиздяй|распиздяйство|распроеть|сволота|сволочь|сговнять|секель|серун|серька|сестроеб|сикель|сила|сирать|сирывать|соси|спиздел|спиздеть|спиздил|спиздила|спиздили|спиздит|спиздить|срака|сраку|сраный|сранье|срать|срун|ссака|ссышь|стерва|страхопиздище|сука|суки|суходрочка|сучара|сучий|сучка|сучко|сучонок|сучье|сцание|сцать|сцука|сцуки|сцуконах|сцуль|сцыха|сцышь|съебаться|сыкун|трахае6|трахаеб|трахаёб|трахатель|ублюдок|уебать|уёбища|уебище|уёбище|уебищное|уёбищное|уебк|уебки|уёбки|уебок|уёбок|урюк|усраться|ушлепок|х_у_я_р_а|хyё|хyй|хyйня|хамло|хер|херня|херовато|херовина|херовый|хитровыебанный|хитрожопый|хуeм|хуе|хуё|хуевато|хуёвенький|хуевина|хуево|хуевый|хуёвый|хуек|хуёк|хуел|хуем|хуенч|хуеныш|хуенький|хуеплет|хуеплёт|хуепромышленник|хуерик|хуерыло|хуесос|хуесоска|хуета|хуетень|хуею|хуи|хуй|хуйком|хуйло|хуйня|хуйрик|хуище|хуля|хую|хуюл|хуя|хуяк|хуякать|хуякнуть|хуяра|хуясе|хуячить|целка|чмо|чмошник|чмырь|шалава|шалавой|шараёбиться|шлюха|шлюхой|шлюшка|ябывает)$/i, (message) => {
if(!message.isChat) return;
   let id = message.chatId;
   chats[id].matmsg += 1;
   m.stats.matmsg += 1;
});


updates.hear(/^(.)(?:правило|правила|rules)$/i, (message) => {
if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
let user = acc.users[user_id(message.user)];
return message.send(`@id${user.id} (${m.name}), Вот правило беседы:

${chats[message.chatId].rules}`);
  });

updates.hear(/^(.)(?:setrules|updaterules|новые правила|новыеправила)\s?([^]+)$/i, (message) => {
  let user = acc.users[user_id(message.user)];
  let chatid = message.chatId;
 if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  if(m.group < chats[message.chatId].dostup.setrules) return message.send(`Доступ с ${chats[message.chatId].dostup.setrules.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
if(message.replyMessage){
 let id = message.replyMessage.text;
chats[message.chatId].rules = `${id}`;
return message.send(`Новое правила установлены!`);
}

if(message.forwards[0]){
chats[message.chatId].rules = `${message.forwards[0].text}`;
return message.send(`Новое правила установлены!`);
}

if(message.$match[2]){
chats[message.chatId].rules = message.$match[2];
return message.send(`Новое правила установлены!`);
}
});


updates.hear(/^(.)(?:снять|user|пользователь|к чертям|пидарас)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
   let user = acc.users[user_id(message.user)];
    if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
   let chatid = message.chatId;
  if(m.group < chats[message.chatId].dostup.user) return message.send(`Доступ с ${chats[message.chatId].dostup.user.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

      if(message.replyMessage){
    let id = message.replyMessage.senderId;
    chats[message.chatId].users[id].group = 0;
    return message.send('Данный @id' + id + ', (Пользователь), теперь пользователь.');
    }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let id = message.forwards[0].senderId;
      chats[message.chatId].users[id].group = 0;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}), теперь пользователь.`);
    }

   if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
        let user = res;
       if(!chats[message.chatId].users[user.object_id]) return message.send(`[Error] » Участник не найден!`);
      if(chats[message.chatId].users[user.object_id].group >= 4) return message.send(`[Error] » Данный пользователь имеет привилегию выше!`)
      chats[message.chatId].users[user.object_id].group = 0;
      return message.send(`@id${user.object_id} (${chats[message.chatId].users[user.object_id].name}), вы теперь пользователь.`);
    })
  }else{
         let help_id = message.$match[4];
     if(!chats[message.chatId].users[help_id]) return message.send(`[Error] » Участник не найден!`);
      if(chats[message.chatId].users[help_id].group >= 4) return message.send(`[Error] » Данный пользователь имеет привилегию выше!`);
      chats[message.chatId].users[help_id].group = 0;
      return message.send(`@id${help_id} (${chats[message.chatId].users[help_id].name}), вы теперь пользователь.`);
}
});

updates.hear(/^(.)(?:moder|модер|модератор)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
   let user = acc.users[user_id(message.user)];
    if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[id].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
   let chatid = message.chatId;
     if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(m.group < chats[message.chatId].dostup.moder) return message.send(`Доступ с ${chats[message.chatId].dostup.moder.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

     if(message.replyMessage){
    let id = message.replyMessage.senderId;
     if(chats[message.chatId].users[id].group >= 1) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[id].group = 1;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}), теперь имеет роль Модератор`);
   }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let id = message.forwards[0].senderId;
    if(chats[message.chatId].users[id].group >= 1) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[id].group = 1;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}), вы теперь Модератор.`);
    }

   if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
        let user = res;
      if(!chats[message.chatId].users[user.object_id]) return message.send(`[Error] » Участник не найден!`);
      if(chats[message.chatId].users[user.object_id].group >= 1) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[user.object_id].group = 1;
      return message.send(`@id${user.object_id} (${chats[message.chatId].users[user.object_id].name}), вы теперь Модератор.`);
    })
  }else{
         let help_id = message.$match[4];
     if(!chats[message.chatId].users[help_id]) return message.send(`[Error] » Участник не найден!`);
      if(chats[message.chatId].users[help_id].group >= 1) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[help_id].group = 1;
      return message.send(`@id${help_id} (${chats[message.chatId].users[help_id].name}), вы теперь Модератор.`);
}
});

updates.hear(/^(.)(?:moder.st|st.m|Ст.модерснять|неуловимый)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
    let user = acc.users[user_id(message.user)];
   if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
   let chatid = message.chatId;
  if(m.group < chats[message.chatId].dostup.admin) return message.send(`Доступ с ${chats[message.chatId].dostup.admin.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

      if(message.replyMessage){
    let id = message.replyMessage.senderId;
     if(chats[message.chatId].users[id].group >= 2) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[id].group = 2;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}), теперь имеет роль Ст.модер`);
   }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let id = message.forwards[0].senderId;
    if(chats[message.chatId].users[id].group >= 2) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[id].group = 2;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}), вы теперь Ст.модер.`);
    } else{
         let help_id = message.$match[4];
      if(chats[message.chatId].users[help_id].group >= 2) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[help_id].group = 2;
      return message.send(`@id${help_id} (${chats[message.chatId].users[help_id].name}), вы теперь Ст.модер.`);
}

   if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
        let user = res;
      if(chats[message.chatId].users[res.object_id].group >= 2) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[res.object_id].group = 2;
      return message.send(`@id${user.object_id} (${chats[message.chatId].users[user.object_id].name}), вы теперь Администратор.`);
    })
}
});

updates.hear(/^(.)(?:helper|Администратор|админ)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
    if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  let user = acc.users[user_id(message.user)];
   if(m.group < chats[message.chatId].dostup.helper) return message.send(`Доступ с ${chats[message.chatId].dostup.helper.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

     if(message.replyMessage){
    let id = message.replyMessage.senderId;
     if(chats[message.chatId].users[id].group >= 3) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[id].group = 3;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}), теперь имеет роль Администратор`);
   }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let id = message.forwards[0].senderId;
    if(chats[message.chatId].users[id].group >= 3) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[id].group = 3;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}), вы теперь Администратор.`);
    }

   if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
        let user = res;
      if(!chats[message.chatId].users[user.object_id]) return message.send(`[Error] » Участник не найден!`);
      if(chats[message.chatId].users[user.object_id].group >= 3) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[user.object_id].group = 3;
      return message.send(`@id${user.object_id} (${chats[message.chatId].users[user.object_id].name}) вы теперь Администратор.`);
    })
  }else{
         let help_id = message.$match[4];
     if(!chats[message.chatId].users[help_id]) return message.send(`[Error] » Участник не найден!`);
      if(chats[message.chatId].users[help_id].group >= 3) return message.send(`[Error] » Данный пользователь уже может рекламировать или даже имеет привилегию выше!`)
      chats[message.chatId].users[help_id].group = 3;
      return message.send(`@id${help_id} (${chats[message.chatId].users[help_id].name}), вы теперь Администратор.`);
}
});

updates.hear(/^(.)(?:вечный бан|вечнбан|нахуй|permban)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
     if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  let user = acc.users[user_id(message.user)];
  if(m.group < chats[message.chatId].dostup.permban) return message.send(`Доступ с ${chats[message.chatId].dostup.permban.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

      if(message.replyMessage){
    let id = message.replyMessage.senderId;
    if(message.replyMessage.senderId == 498281739) return message.reply('[⚠] » Отказ');

     if(m.group < chats[message.chatId].users[id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
    if(chats[message.chatId].users[id].isBanned && chats[message.chatId].users[id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) уже забанен.`)
        chats[message.chatId].banlength += 1;
       chats[message.chatId].users[id].isBanned = true;
        chats[message.chatId].users[id].permanently = true;
        chats[message.chatId].users[id].group = 0;
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: id });
                 vk.api.call('messages.send', { user_id: id, random_id: 0, message: `
[⚠] » Получена информация о бане в чате ${chats[message.chatId].title}
[🕛] » Время бана: ${data()} в ${time()}
[📗] » Вас забанил: @id${message.user} (${acc.users[user_id(message.user)].prefix})
[📙] » Вы забанены навсегда.
` })
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - забанен навсегда.`);
    }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let id = message.forwards[0].senderId;

     if(m.group < chats[message.chatId].users[id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
    if(chats[message.chatId].users[id].isBanned && chats[message.chatId].users[id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) уже забанен.`)
        chats[message.chatId].banlength += 1;
        chats[message.chatId].users[id].isBanned = true;
        chats[message.chatId].users[id].permanently = true;
        chats[message.chatId].users[id].group = 0;
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: id });
                 vk.api.call('messages.send', { user_id: id, random_id: 0, message: `
[⚠] » Получена информация о бане в чате ${chats[message.chatId].title}
[🕛] » Время бана: ${data()} в ${time()}
[📗] » Вас забанил: @id${message.user} (${acc.users[user_id(message.user)].prefix})
[📙] » Вы забанены навсегда.
` })
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - забанен навсегда.`);
    }


   if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
        if(res.object_id == 498281739) return message.reply('пошол нах');
      if(!chats[message.chatId].users[res.object_id]) return message.send(`[Error] » Участник не найден!`);

      if(m.group < chats[message.chatId].users[res.object_id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
      if(chats[message.chatId].users[res.object_id].isBanned && chats[message.chatId].users[res.object_id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[res.object_id].name}) уже забанен.`)
        chats[message.chatId].banlength += 1;
            chats[message.chatId].users[res.object_id].isBanned = true;
        chats[message.chatId].users[res.object_id].permanently = true;
        chats[message.chatId].users[res.object_id].group = 0;
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: res.object_id });
                 vk.api.call('messages.send', { user_id: res.object_id, random_id: 0, message: `
[⚠] » Получена информация о бане в чате ${chats[message.chatId].title}
[🕛] » Время бана: ${data()} в ${time()}
[📗] » Вас забанил: @id${message.user} (${acc.users[user_id(message.user)].prefix})
[📙] » Вы забанены навсегда.
` })
      return message.send(`@id${res.object_id} (${chats[message.chatId].users[res.object_id].name}) - забанен навсегда.`);
    })
  }else{
         let perm_id = message.$match[4];
     if(perm_id == 498281739) return message.reply('пошол нах');
      if(!chats[message.chatId].users[perm_id]) return message.send(`[Error] » Участник не найден!`);

        if(m.group < chats[message.chatId].users[perm_id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
      if(chats[message.chatId].users[perm_id].isBanned && chats[message.chatId].users[perm_id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[perm_id_id].name}) уже забанен.`)
        chats[message.chatId].banlength += 1;
        chats[message.chatId].users[perm_id].isBanned = true;
        chats[message.chatId].users[perm_id].permanently = true;
        chats[message.chatId].users[perm_id].group = 0;
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: perm_id });
                  vk.api.call('messages.send', { user_id: perm_id, random_id: 0, message: `
[⚠] » Получена информация о бане в чате ${chats[message.chatId].title}
[📗] » Вас забанил: @id${message.user} (${acc.users[user_id(message.user)].prefix})
[📙] » Вы забанены навсегда.
` })
      return message.send(`@id${perm_id} (${chats[message.chatId].users[perm_id].name}) - забанен.`);
}
});


updates.hear(/^(.)(?:unban|разбан|разблокировать|разбанить)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
     if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
    let user = acc.users[user_id(message.user)];
   if(m.group < chats[message.chatId].dostup.unban) return message.send(`Доступ с ${chats[message.chatId].dostup.unban.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

     if(message.replyMessage){
    let id = message.replyMessage.senderId;
    if(message.replyMessage.senderId == 498281739) return message.reply('[⚠] » Отказ');
    if(chats[message.chatId].users[id].isBanned == false && chats[message.chatId].users[id].permanently == false) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) не заблокрован.`)
if(!chats[message.chatId].users[id].isBanned && chats[message.chatId].users[id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[id].name})не забанен.`)
        chats[message.chatId].banlength -= 1;
            if(chats[message.chatId].users[id].tban != 0){
        chats[message.chatId].users[id].tban = 0
      }
            chats[message.chatId].users[id].isBanned = false;
        chats[message.chatId].users[id].permanently = false;
        chats[message.chatId].users[id].group = 0;
        chats[message.chatId].users[id].reason = "";
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - разбанен.`);
    }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let id = message.forwards[0].senderId;
  if(chats[message.chatId].users[id].isBanned == false && chats[message.chatId].users[id].permanently == false) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) не заблокрован.`)
      if(!chats[message.chatId].users[id].isBanned && chats[message.chatId].users[id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) не забанен.`)
        chats[message.chatId].banlength -= 1;
            if(chats[message.chatId].users[id].tban != 0){
        chats[message.chatId].users[id].tban = 0
      }
            chats[message.chatId].users[id].isBanned = false;
        chats[message.chatId].users[id].permanently = false;
        chats[message.chatId].users[id].group = 0;
        chats[message.chatId].users[id].reason = "";
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - разбанен.`);
    }

  if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
        let user = res;
    if(chats[message.chatId].users[user.object_id].isBanned == false && chats[message.chatId].users[user.object_id].permanently == false) return message.send(`@id${user.object_id} (${chats[message.chatId].users[user.object_id].name}) не заблокрован.`)
       if(!chats[message.chatId].users[user.object_id]) return message.send(`[Error] » Участник не найден!`);
      if(!chats[message.chatId].users[user.object_id].isBanned && chats[message.chatId].users[user.object_id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[res.object_id].name}) не забанен.`)
        chats[message.chatId].banlength -= 1;
            if(chats[message.chatId].users[res.object_id].tban != 0){
        chats[message.chatId].users[res.object_id].tban = 0
      }
            chats[message.chatId].users[user.object_id].isBanned = false;
        chats[message.chatId].users[user.object_id].permanently = false;
        chats[message.chatId].users[user.object_id].group = 0;
        chats[message.chatId].users[user.object_id].reason = "";
      return message.send(`@id${user.object_id} (${chats[message.chatId].users[res.object_id].name}) - разбанен.`);
    })
  }else{
         let unban_id = message.$match[4];
     if(chats[message.chatId].users[unban_id].isBanned == false && chats[message.chatId].users[unban_id].permanently == false) return message.send(`@id${unban_id} (${chats[message.chatId].users[unban_id].name}) не заблокрован.`)
     if(!chats[message.chatId].users[unban_id]) return message.send(`[Error] » Участник не найден!`);
      if(!chats[message.chatId].users[unban_id].isBanned && chats[message.chatId].users[unban_id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[unban_id].name}) не забанен.`)
        chats[message.chatId].banlength -= 1;
      if(chats[message.chatId].users[unban_id].tban != 0){
        chats[message.chatId].users[unban_id].tban = 0
      }
            chats[message.chatId].users[unban_id].isBanned = false;
        chats[message.chatId].users[unban_id].permanently = false;
        chats[message.chatId].users[unban_id].group = 0;
        chats[message.chatId].users[unban_id].reason = "";
        return message.send(`@id${unban_id} (${chats[message.chatId].users[unban_id].name}) - разбанен.`);
}
});

updates.hear(/^(.)(?:ban|бан|забанить)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
    if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  let user = acc.users[user_id(message.user)];
  let a = m;
   if(m.group < chats[message.chatId].dostup.ban) return message.send(`Доступ с ${chats[message.chatId].dostup.ban.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

    if(message.replyMessage){
    let id = message.replyMessage.senderId;
    if(message.replyMessage.senderId == 498281739) return message.reply('[⚠] » Отказ');

        if(m.group < chats[message.chatId].users[id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
         if(chats[message.chatId].users[id].isBanned && chats[message.chatId].users[id].permanently) return message.send('@id' + id + ' уже забанен.')
        chats[message.chatId].banlength += 1;
        chats[message.chatId].users[id].isBanned = true;
        chats[message.chatId].users[id].permanently = true;
        chats[message.chatId].users[id].group = 0;
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: id });
                   vk.api.call('messages.send', { user_id: id, random_id: 0, message: `
[⚠] » Получена информация о бане в чате ${chats[message.chatId].title}
[📗] » Вас забанил: @id${message.user} (${acc.users[user_id(message.user)].prefix})
[📙] » Вы забанены ${data()} в ${time()}
` })
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - забанен.`);
    }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let id = message.forwards[0].senderId;

     if(m.group < chats[message.chatId].users[id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
         if(chats[message.chatId].users[id].isBanned && chats[message.chatId].users[id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) уже забанен.`)
        chats[message.chatId].banlength += 1;
            chats[message.chatId].users[id].isBanned = true;
        chats[message.chatId].users[id].permanently = true;
        chats[message.chatId].users[id].group = 0;
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: id });
                   vk.api.call('messages.send', { user_id: id, random_id: 0, message: `
[⚠] » Получена информация о бане в чате ${chats[message.chatId].title}
[📗] » Вас забанил: @id${message.user} (${acc.users[user_id(message.user)].prefix})
[📙] » Вы забанены ${data()} в ${time()}
` })
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - забанен.`);
    }

  if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
        if(res.object_id == 498281739) return message.reply('пошол нах');
      if(!chats[message.chatId].users[res.object_id]) return message.send(`[Error] » Участник не найден!`);

          if(m.group < chats[message.chatId].users[res.object_id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
      if(chats[message.chatId].users[res.object_id].isBanned && chats[message.chatId].users[res.object_id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[res.object_id].name}) уже забанен.`)
        chats[message.chatId].banlength += 1;
            chats[message.chatId].users[res.object_id].isBanned = true;
        chats[message.chatId].users[res.object_id].permanently = true;
        chats[message.chatId].users[res.object_id].group = 0;
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: res.object_id });
                   vk.api.call('messages.send', { user_id: res.object_id, random_id: 0, message: `
[⚠] » Получена информация о бане в чате ${chats[message.chatId].title}
[📗] » Вас забанил: @id${message.user} (${acc.users[user_id(message.user)].prefix})
[📙] » Вы забанены ${data()} в ${time()}
` })
      return message.send(`@id${res.object_id} (${chats[message.chatId].users[res.object_id].name}) - забанен.`);
    })
  }else{
         let perm_id = message.$match[4];
     if(perm_id == 498281739) return message.reply('пошол нах');
      if(!chats[message.chatId].users[perm_id]) return message.send(`[Error] » Участник не найден!`);

            if(m.group < chats[message.chatId].users[perm_id].group) return message.send(`❌ Нельзя забанить данного пользователя ❌`);
      if(chats[message.chatId].users[perm_id].isBanned && chats[message.chatId].users[perm_id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) уже забанен.`)
        chats[message.chatId].banlength += 1;
            chats[message.chatId].users[perm_id].isBanned = true;
        chats[message.chatId].users[perm_id].permanently = true;
        chats[message.chatId].users[perm_id].group = 0;
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: perm_id });
                 vk.api.call('messages.send', { user_id: perm_id, random_id: 0, message: `
[⚠] » Получена информация о бане в чате ${chats[message.chatId].title}
[📗] » Вас забанил: @id${message.user} (${acc.users[user_id(message.user)].prefix})
[📙] » Вы забанены ${data()} в ${time()}
` })
      return message.send(`@id${perm_id} (${chats[message.chatId].users[perm_id].name}) - забанен.`);
}
});

updates.hear(/^(.)(?:tempban|тбан|тзабанить|вбан|темпбан|бан на время)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)\s?([0-9]+)\s?([^]+)?$/i, message => {
    if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
   if(m.group < chats[message.chatId].dostup.tempban) return message.send(`Доступ с ${chats[message.chatId].dostup.tempban.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

    if(message.replyMessage){
    let id = message.replyMessage.senderId;
    if(message.replyMessage.senderId == 498281739) return message.reply('[⚠] » Отказ');

     if(m.group < chats[message.chatId].users[id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
      if(chats[message.chatId].users[id].isBanned && chats[message.chatId].users[id].permanently) return message.send('@id' + id + ' уже забанен.')

        chats[message.chatId].users[id].tban = message.$match[7].toString().replace(/(м|минута|минуты|минут)/gi, `${message.$match[6] * 60}`).replace(/(ч|часа|часов|час)/gi, `${message.$match[6] * 3600}`).replace(/(д|дней|дня|дн)/gi, `${message.$match[6] * 86400}`)
        chats[message.chatId].users[id].isBanned = true;
        chats[message.chatId].users[id].permanently = true;
        chats[message.chatId].users[id].group = 0;
        chats[message.chatId].banlength += 1;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - забанен.`);
    }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
    let id = message.forwards[0].senderId;

     if(m.group < chats[message.chatId].users[id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);
       if(chats[message.chatId].users[id].isBanned && chats[message.chatId].users[id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) уже забанен.`)

        chats[message.chatId].users[id].tban = message.$match[7].toString().replace(/(м|минута|минуты|минут)/gi, `${message.$match[6] * 60}`).replace(/(ч|часа|часов|час)/gi, `${message.$match[6] * 3600}`).replace(/(д|дней|дня|дн)/gi, `${message.$match[6] * 86400}`)
        chats[message.chatId].users[id].isBanned = true;
        chats[message.chatId].users[id].permanently = true;
        chats[message.chatId].users[id].group = 0;
        chats[message.chatId].banlength += 1;
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - забанен.`);
    }

  if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
        if(res.object_id == 498281739) return message.reply('пошол нах');
      if(!chats[message.chatId].users[res.object_id]) return message.send(`[Error] » Участник не найден!`);
   if(m.group < chats[message.chatId].users[res.object_id].group) return message.send(`❌ Нельзя забанить этого пользователя ❌`);

        chats[message.chatId].users[res.object_id].tban = message.$match[7].toString().replace(/(м|минута|минуты|минут)/gi, `${message.$match[6] * 60}`).replace(/(ч|часа|часов|час)/gi, `${message.$match[6] * 3600}`).replace(/(д|дней|дня|дн)/gi, `${message.$match[6] * 86400}`)
        chats[message.chatId].users[res.object_id].isBanned = true;
        chats[message.chatId].users[res.object_id].permanently = true;
        chats[message.chatId].users[res.object_id].group = 0;
        chats[message.chatId].banlength += 1;
      return message.send(`@id${res.object_id} (${chats[message.chatId].users[res.object_id].name}) - забанен.`);
    })
  }else{
         let perm_id = message.$match[4];
     if(perm_id == 498281739) return message.reply('пошол нах');
      if(!chats[message.chatId].users[perm_id]) return message.send(`[Error] » Участник не найден!`);

      if(m.group < chats[message.chatId].users[perm_id].group) return message.send(`❌ Нельзя забанить данного пользователя ❌`);
      if(chats[message.chatId].users[perm_id].isBanned && chats[message.chatId].users[perm_id].permanently) return message.send(`@id${id} (${chats[message.chatId].users[id].name}) уже забанен.`)
        chats[message.chatId].users[perm_id].tban = message.$match[7].toString().replace(/(м|минута|минуты|минут)/gi, `${message.$match[6] * 60}`).replace(/(ч|часа|часов|час)/gi, `${message.$match[6] * 3600}`).replace(/(д|дней|дня|дн)/gi, `${message.$match[6] * 86400}`)
        chats[message.chatId].users[perm_id].isBanned = true;
        chats[message.chatId].users[perm_id].permanently = true;
        chats[message.chatId].banlength += 1;
        chats[message.chatId].users[perm_id].group = 0;
      return message.send(`@id${perm_id} (${chats[message.chatId].users[perm_id].name}) - забанен.`);
}
});

updates.hear(/^(.)(?:kick|кик)(\s?https\:\/\/vk\.com\/)?(id|club|public)?([0-9]+)?([^]+)?$/i, (message) => {
        if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
let user = acc.users[user_id(message.user)];
if(m.group < chats[message.chatId].dostup.kick) return message.send(`Доступ с ${chats[message.chatId].dostup.kick.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

    if(message.replyMessage){
  let id = message.replyMessage.senderId;
    if(id > 0){
      if(m.group < chats[message.chatId].users[message.replyMessage.senderId].group) return message.send(`❌ Нельзя кикнуть данного пользователя ❌`);

   vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: id })
      return message.send(`@id${id} (${chats[message.chatId].users[id].name}) - исключен.`);
    }
      if(id < 0){
        message.send(`Вы успешно исключили группу @id${chats[message.chatId].groups[id].sname} (${chats[message.senderId].groups[id].name})`)
        vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: id })
      }
    }

     if(message.forwards[0]){
    let id = message.forwards[0].senderId;

    if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');

   if(id > 0){
    if(m.group < chats[message.chatId].users[message.forwards[0].senderId].group) return message.send(`❌ Нельзя кикнуть данного пользователя ❌`);

   vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: message.forwards[0].senderId })
  message.send(`[❌] » Пользователь @id${message.forwards[0].senderId} (${chats[message.chatId].users[message.forwards[0].senderId].name}) был исключен из беседы `);
  }
   if(id < 0){
        message.send(`Вы успешно исключили группу @id${chats[message.chatId].groups[id].sname} (${chats[message.senderId].groups[id].name})`)
         vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: id })
      }
  }

  if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((response) => {
    if(response.type == "user"){
    if(response.object_id == 498281739) return message.reply('[⚠] » Отказ');
  let user = response;

       if(m.group < chats[message.chatId].users[response.object_id].group) return message.send(`❌ Нельзя кикнуть данного пользователя ❌`);

      vk.api.call("messages.removeChatUser", {chat_id: message.chatId, member_id: response.object_id })
      .catch((error) => {return message.send(`[⚠] » Ошибка. Возможные причины:\n[⚠] » В данной беседе группа не Ст.модер\n[⚠] » Такого игрока нет в беседе.`);
      });
                  message.send(`[❌] » Пользователь @id${user.object_id} (${chats[message.chatId].users[user.object_id].name}) был исключен из беседы `);
      return
      }

   if(response.type == "group"){
    vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: "-"+response.object_id }).catch((error) => {return message.send(`[⚠] » Ошибка. Возможные причины:\n[⚠] » В данной беседе группа не Ст.модер\n[⚠] » Такого игрока нет в беседе.`);
      });
         return message.send(`Вы успешно исключили группу @${chats[message.chatId].groups[-response.object_id].sname} (${chats[message.chatId].groups[-response.object_id].name})`);
      }
    })
  }else{
     let kick_id = message.$match[4];
    if(message.$match[3].toLowerCase() == 'club' || message.$match[3].toLowerCase() == 'public'){
      vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: "-"+message.$match[4] })
       message.send(`Вы успешно исключили группу @${chats[message.chatId].groups[-message.$match[4]].sname} (${chats[message.chatId].groups[-message.$match[4]].name})`)
    }
    if(message.$match[3].toLowerCase() == 'id'){
     if(m.group < chats[message.chatId].users[kick_id].group) return message.send(`❌ Нельзя кикнуть данного пользователя ❌`);

    vk.api.call("messages.removeChatUser", { chat_id: message.chatId, user_id: message.$match[4] }).
    catch((error) => {return message.send(`[⚠] » Ошибка. Возможные причины:\n[⚠] » В данной беседе группа не Ст.модер\n[⚠] » Такого игрока нет в беседе.`);});
          message.send(`[❌] » Пользователь @id${kick_id} (${chats[message.chatId].users[kick_id].name}) был исключен из беседы `);
    return
   }
  }
});

updates.hear(/^(.)(?:warn|варн|заварнить)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
        if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
  let user = acc.users[user_id(message.user)];
      let chatid = message.chatId;
   if(m.group < chats[message.chatId].dostup.warn) return message.send(`Доступ с ${chats[message.chatId].dostup.warn.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

     if(message.replyMessage){
    let id = message.replyMessage.senderId;
    if(message.replyMessage.senderId == 498281739) return message.reply('[⚠] » Отказ');
       if(!chats[message.chatId].users[id]) return message.send(`❌ Участник не найден!`)
     if(m.group < chats[message.chatId].users[id].group) return message.send(`❌ Нельзя сделать предупреждение этому игроку ❌`);

      if(chats[message.chatId].users[id].isBanned == true) {
        return message.send('Пользователь и так уже заблокирован!');
      }
      if(chats[message.chatId].users[id].isBanned == false) {
        if(chats[message.chatId].users[id].warns >= 2) {
    vk.api.call("messages.removeChatUser", {chat_id: chatid, user_id: id})
    message.send(`@id${id} (${chats[message.chatId].users[id].name}) был кикнут из беседы за большое количество нарушений, на ${timer(3600)}.`)
    chats[message.chatId].users[id].reason = "Ссылки на подозрительные ресурсы";
    chats[message.chatId].banlength += 1;
        chats[message.chatId].users[id].isBanned = true;
        chats[message.chatId].users[id].tban = 3600
    chats[message.chatId].users[id].warns = 0;
  }
 }
  if(chats[message.chatId].users[id].isBanned == false) {
        chats[message.chatId].users[id].warns += 1
       return message.send(`
@id${id} (${chats[message.chatId].users[id].name}) Вы получили предупреждение!!
Теперь у вас [${chats[message.chatId].users[id].warns}/${chats[message.chatId].setting.warns}] предупреждений `)
}
    }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
     let id = message.forwards[0].senderId;
    if(!chats[message.chatId].users[id]) return message.send(`❌ Участник не найден!`);
       if(m.group < chats[message.chatId].users[id].group) return message.send(`❌ Нельзя сделать предупреждение этому игроку ❌`);

      if(chats[message.chatId].users[id].isBanned == true) {
        return message.send('Пользователь и так уже заблокирован!');
      }
      if(chats[message.chatId].users[id].isBanned == false) {
        if(chats[message.chatId].users[id].warns >= 2) {
    vk.api.call("messages.removeChatUser", {chat_id: chatid, user_id: id})
    message.send(`@id${id} (${chats[message.chatId].users[id].name}), был кикнут из беседы за большое количество нарушений, на ${timer(3600)}.`)
    chats[message.chatId].banlength += 1;
    chats[message.chatId].users[id].reason = "Ссылки на подозрительные ресурсы";
    chats[message.chatId].users[id].isBanned = true;
    chats[message.chatId].users[id].tban = 3600
    chats[message.chatId].users[id].warns = 0;
  }
 }
  if(chats[message.chatId].users[id].isBanned == false) {
        chats[message.chatId].users[id].warns += 1
      return message.send(`
@id${id} (${chats[message.chatId].users[id].name}) Вы получили предупреждение!!
Теперь у вас [${chats[message.chatId].users[id].warns}/${chats[message.chatId].setting.warns}] предупреждений `)
}
}

  if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
            let user = res;
        if(m.group < chats[message.chatId].users[res.object_id].group) return message.send(`❌ Нельзя сделать предупреждение этому игроку ❌`);
      if(user.object_id == 498281739) return message.reply('пошол нах');
      if(!chats[message.chatId].users[user.object_id]) return message.send(`❌ Участник не найден!`);

      if(chats[message.chatId].users[user.object_id].isBanned == true) {
        return message.send('Пользователь и так уже заблокирован!');
      }
      if(chats[message.chatId].users[user.object_id].isBanned == false) {
        if(chats[message.chatId].users[user.object_id].warns >= 2) {
    vk.api.call("messages.removeChatUser", {chat_id: chatid, user_id: user.object_id})
    message.send(`@id${user.object_id} (${chats[message.chatId].users[user.object_id].name}), был кикнут из беседы за большое количество нарушений, на ${timer(3600)}.`)
    chats[message.chatId].banlength += 1;
    chats[message.chatId].users[user.object_id].reason = "Ссылки на подозрительные ресурсы";
    chats[message.chatId].users[user.object_id].isBanned = true;
    chats[message.chatId].users[res.object_id].tban = 3600
    chats[message.chatId].users[user.object_id].warns = 0;
  }
 }
  if(chats[message.chatId].users[user.object_id].isBanned == false) {
        chats[message.chatId].users[user.object_id].warns += 1
  return message.send(`
@id${user.object_id} (${chats[message.chatId].users[user.object_id].name}), Вы получили предупреждение!!
Теперь у вас [${chats[message.chatId].users[user.object_id].warns}/${chats[message.chatId].setting.warns}] предупреждений `)
}
    })
  }else{
         let warn_id = message.$match[4];
      if(m.group < chats[message.chatId].users[warn_id].group) return message.send(`❌ Нельзя сделать предупреждение этому игроку ❌`);
      if(warn_id == 498281739) return message.reply('пошол нах');
      if(!chats[message.chatId].users[warn_id]) return message.send(`❌ Участник не найден!`);

      if(chats[message.chatId].users[warn_id].isBanned == true) {
        return message.send('Пользователь и так уже заблокирован!');
      }

      if(chats[message.chatId].users[warn_id].isBanned == false) {
        if(chats[message.chatId].users[warn_id].warns >= chats[message.chatId].setting.warns) {
    vk.api.call("messages.removeChatUser", {chat_id: chatid, user_id: warn_id })
    message.send(`@id${warn_id} (${chats[message.chatId].users[warn_id].name}), был кикнут из беседы за большое количество нарушений.`)
    chats[message.chatId].banlength += 1;
    chats[message.chatId].users[warn_id].reason = "Ссылки на подозрительные ресурсы";
    chats[message.chatId].users[warn_id].isBanned = true;
    chats[message.chatId].users[warn_id].tban = 3600
    chats[message.chatId].users[warn_id].warns = 0;
  }
 }
  if(chats[message.chatId].users[warn_id].isBanned == false) {
        chats[message.chatId].users[warn_id].warns += 1
      return message.send(`
@id${warn_id} (${chats[message.chatId].users[warn_id].name}), Вы получили предупреждение!
Теперь у вас [${chats[message.chatId].users[warn_id].warns}/${chats[message.chatId].setting.warns}] предупреждений `)
}
}
});

updates.hear(/^(.)(?:unwarn|унварн|убратьварн|убрать предупреждение|снять варн|анварн)(\shttps\:\/\/vk\.com\/)?(id|club)?([0-9]+)?([^]+)?$/i, message => {
    if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
let user = acc.users[user_id(message.user)];
       let chatid = message.chatId
   if(m.group < chats[message.chatId].dostup.unwarn) return message.send(`Доступ с ${chats[message.chatId].dostup.unwarn.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

    if(message.replyMessage){
    let id = message.replyMessage.senderId;
    if(chats[message.chatId].users[id].warns == 0) return message.send(`У @id${id} (${chats[message.chatId].users[id].name}) нет предупреждений .`)
    if(message.replyMessage.senderId == 498281739) return message.reply('[⚠] » Отказ');
      chats[message.chatId].users[id].warns = 0
        return message.send(`@id${id} (${chats[message.chatId].users[id].name}) теперь у вас 0 предупреждений`)
  }

     if(message.forwards[0]){
     if(message.forwards[0].senderId == 498281739) return message.reply('[⚠] » Отказ');
     let id = message.forwards[0].senderId;
   if(chats[message.chatId].users[id].warns == 0) return message.send(`У @id${id} (${chats[message.chatId].users[id].name}) нет предупреждений .`)
    chats[message.chatId].users[id].warns = 0
    return message.send(`@id${id} (${chats[message.chatId].users[id].name}) теперь у вас 0 предупреждений`)
  }

  if(message.$match[5]) {
    var domain = message.$match[5].split(" ");
    vk.api.call("utils.resolveScreenName", {
    screen_name: message.$match[5]
  }).then((res) => {
            let user = res;
      if(chats[message.chatId].users[user.object_id].warns == 0) return message.send(`У @id${user.object_id} (${chats[message.chatId].users[user.object_id].name}) нет предупреждений .`)
      if(!chats[message.chatId].users[user.object_id]) return message.send(`❌ Участник не найден!`);
      chats[message.chatId].users[user.object_id].warns = 0
      return message.send(`@id${user.object_id} (${chats[message.chatId].users[res.object_id].name}) теперь у вас 0 предупреждений`);
    })
  }else{
         let warn_id = message.$match[4];
     if(chats[message.chatId].users[warn_id].warns == 0) return message.send(`У @id${warn_id} (${chats[message.chatId].users[warn_id].name}) нет предупреждений .`)
     if(!chats[message.chatId].users[warn_id]) return message.send(`❌ Участник не найден!`);
      chats[message.chatId].users[warn_id].warns = 0
      return message.send(`@id${warn_id} (${chats[message.chatId].users[warn_id].name}) теперь у вас 0 предупреждений`);
}
});

updates.hear(/^(.)(?:title|name|название)\s?([^]+)?$/i, (message) => {
  if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
 let user = acc.users[user_id(message.user)];
 let chatid = message.chatId;
 if(m.group < chats[message.chatId].dostup.title) return message.send(`Доступ с ${chats[message.chatId].dostup.title.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
  chats[chatid].title = message.$match[2]
   vk.api.messages.editChat({ chat_id: chatid, title: message.$match[2] })
   message.send(`Вы успешно сменили название чата на ${message.$match[2]}`)
})

updates.hear(/^(?:givegold|addgold|bgold)\s?([0-9]+)?$/i, (message) => {
  if(message.user !== 498281739) return;
 if(chats[message.$match[1]].bgold == true) return message.send(`[⚠] » У данного чата есть уже gold`);
 if(!message.$match[1]) return;
 if(!chats[message.$match[1]]) return message.send(`[⛔] » Чат не обнаружен`);
 chats[message.$match[1]].bgold = true
 message.send(`[✔] » Чату [Id: ${message.$match[1]}] был выдан gold`);
});

updates.hear(/^(.)(?:event|events|settings|события)$/i, (message) => {
 if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[message.chatId].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
 let user = acc.users[user_id(message.user)];
 let chatid = message.chatId;
if(m.group < chats[message.chatId].dostup.event) return message.send(`Доступ с ${chats[message.chatId].dostup.event.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);
  if(chats[chatid].bgold == false) return message.send(`Данная функция доступна для Золотых бесед`);
 message.send(`
[📝] » Настройки беседы
 Могут ли участники приглашать людей — ${chats[chatid].settings.invite.toString().replace(/true/gi, "Да").replace(/false/gi, "Нет")}
  Изменить: "${chats[chatid].prefix}event invite (on|off)"
➖➖➖➖
 Будут ли кикнуты участники после выхода — ${chats[chatid].settings.kick_leave.toString().replace(/true/gi, "Да").replace(/false/gi, "Нет")}
  Изменить: "${chats[chatid].prefix}event kickleave (on|off)"
➖➖➖➖
 Предупреждение за ссылку — ${chats[chatid].settings.url.toString().replace(/true/gi, "Включено").replace(/false/gi, "Выключено")}
  Изменить: "${chats[chatid].prefix}event linkwarn (on|off)"
➖➖➖➖
 Режим тишины — ${chats[chatid].settings.mute.toString().replace(/true/gi, "Включен").replace(/false/gi, "Выключен")}
  Изменить: "${chats[chatid].prefix}event chatmute (on|off)"
➖➖➖➖
 Группы будут кикнуты после приглашения: ${chats[chatid].settings.protectgroup1.toString().replace(/true/gi, "Включено").replace(/false/gi, "Выключено")}
   Изменить: "${chats[chatid].prefix}event kickgroup (on|off)"
`)
});

 updates.hear(/^(.)(?:event|events|settings|события)\s([^]+)\s([^]+)$/i, (message) => {
    let chatid = message.chatId;
    if(!message.isChat) return message.send(`@id${message.user} (${m.name}), пожалуйста, напишите эту команду в беседе.`);
  if(message.$match[1] !== chats[message.chatId].prefix) return message.send(`Неверный префикс, пример ${chats[chatid].prefix}help`);
if(chats[message.chatId].tex == true) return message.send(`@id${message.user} (${m.name}), на данный момент в беседе технический перерыв.`);
      if(chats[chatid].bgold == false) return message.send(`Данная функция доступна для Золотых бесед`);
      if(m.group < chats[message.chatId].dostup.event) return message.send(`Доступ с ${chats[message.chatId].dostup.event.toString().replace(/1/gi, "Модератора").replace(/2/gi, "Ст.модера").replace(/3/gi, "Администратора").replace(/4/gi, "Создателя")}`);

              if(message.$match[2].toLowerCase() == "invite") {
                if(message.$match[3].toLowerCase() == "on") {
                  chats[chatid].settings.invite = true
                  message.send("Теперь участники могут приглашать людей в конференцию.")
                }
                else if(message.$match[3].toLowerCase() == "off") {
                   chats[chatid].settings.invite = false
                  message.send("Теперь участники не могут приглашать людей в конференцию.")
                }
              }
            else if(message.$match[2].toLowerCase() == "kickleave") {
                if(message.$match[3].toLowerCase() == "on") {
                  chats[chatid].settings.kick_leave = true
                  message.send("Теперь участники будут кикнуты после выхода из беседы.")
                }
                else if(message.$match[3].toLowerCase() == "off") {
                  chats[chatid].settings.kick_leave = false
                  message.send("Теперь участники не будут кикнуты после выхода из беседы.")
                }
              }
              else if(message.$match[2].toLowerCase() == "linkwarn") {
                if(message.$match[3].toLowerCase() == "on") {
                  chats[chatid].settings.url = true
                  message.send("Теперь участники получат предупреждение при отправке ссылки на беседу.")
                }
                else if(message.$match[3].toLowerCase() == "off") {
                  chats[chatid].settings.url = false
                  message.send("Теперь участники не получат предупреждение при отправке ссылки на беседу.")
                }
              }
                                     else if(message.$match[2].toLowerCase() == "chatmute") {
                if(message.$match[3].toLowerCase() == "on") {
                  chats[chatid].settings.mute = true
                  message.send(`[❌] » Режим тишины активирован \nПисать в чате можно с роли: "Ст.модер"`)
                }
                else if(message.$match[3].toLowerCase() == "off") {
                  chats[chatid].settings.mute = false
                  message.send("[✔] » Режим тишины де активирован\n Писать в чате могут все.")
                }
              } else if(message.$match[2].toLowerCase() == "kickgroup") {
                if(message.$match[3].toLowerCase() == "on") {
                  chats[chatid].settings.protectgroup1 = true
                  message.send(`Теперь группа после приглашения будет исключена.`)
                }
                else if(message.$match[3].toLowerCase() == "off") {
                  chats[chatid].settings.protectgroup1 = false
                  message.send("Теперь группа после приглашения не будет исключена.")
                }
              }
});

updates.hear(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=🗿]*)/ig, (message) => {
  if(!message.isChat) return;
      let chatid = message.chatId;
      let user = chats[chatid].users[message.user];
            if(chats[chatid].bgold == true){
             if(chats[chatid].settings.url == true){
          if(m.isBanned == true) {
        return message.send('...');
      }

      if(user.group == 0){
        user.warns += 1;
        message.send(`
@id${message.user} (${user.name}), вы получили предупреждение за подозрительные ссылки!
Количество предупреждений: [${user.warns}/${chats[chatid].setting.warns}]`)
        if(user.warns >= chats[chatid].setting.warns){
         user.reason = "Подозрительные ссылки"
         user.isBanned = true
         user.warns = 0
         chats[message.chatId].banlength += 1;
         vk.api.messages.removeChatUser({ chat_id: message.chatId, member_id: message.user })
         message.send(`@id${message.user} (${user.name}), был исключен по причине: "Подозрительные ссылки"`)
        }
      }

     }
    }
});

setInterval(() => {
 for(a in chats){
  for(b in chats[a].users){
    if(chats[a].users[b].tban != 0){
      chats[a].users[b].tban -= 1;
    }
    if(chats[a].users[b].tban != 0){
      if(chats[a].users[b].isBanned != false && chats[a].users[b].permanently != false){
         chats[a].users[b].isBanned = false;
         chats[a].users[b].permanently = false
         chats[a].users[b].banlength -= 1;
      }
    }
  }
 }
}, 1000);

setInterval(() => {
 for(a in chats){
  for(b in chats[a].users){
   chats[a].users[b].active += 1;
  }
}
}, 1000);

//-------------------------------------------------------------------------------\\
async function run() {
    await vk.updates.startPolling();
    console.log('\n\n\nCHAT MANAGER\n\nСЛИТ КАНАЛОМ: ТИПИЧНЫЙ КОДЕР\n\nVK: vk.com/oscrn');
}
//------------------------------------------------------------------------------------\\
run().catch(console.error);
//------------------------------------------------------------------------------------\\
function rand(min, max) {return Math.round(Math.random() * (max - min)) + min}
//------------------------------------------------------------------------------------\\
var parserInt = (str) => parseInt(str.replace(/k|к/ig, "000"));
//------------------------------------------------------------------------------------\\
function spaces(string) {
  if (typeof string !== "string") string = string.toString();
  return string.split("").reverse().join("").match(/[0-9]{1,3}/g).join(".").split("").reverse().join("");
};

function scl(number, titles) {
  cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

function timer(seconds) {
    if(seconds == "") return "0 секунд"
    var days = parseInt(seconds/86400);
    seconds = seconds%86400;
    var hours = parseInt(seconds/3600 );
    seconds = seconds%3600;
    var minutes = parseInt(seconds/60);
    seconds = seconds%60;
    days = (days == 0 ? "" : days + " " + scl(days, ["день", "дня", "дней"]))
    hours = (hours == 0 ? "" : hours + " " + scl(hours, ["час", "часа", "часов"]))
    minutes = (minutes == 0 ? "" : minutes + " " + scl(minutes, ["минуту", "минуты", "минут"]))
    seconds = (seconds == 0 ? "" : seconds + " " + scl(seconds, ["секунду", "секунды", "секунд"]))
    //var gone = days + " " +hours + " " + minutes + " " + seconds
    return `${days} ${hours} ${minutes} ${seconds}`
};

function repl(num){
  var sjop = num.replace(/(k|K|К|к)/ig, "000")
   sjop = sjop.replace(/(все|Все|Всё|всё)/ig, i.money)
  return [sjop]
};

function fix(num) {
num = Number(num)
num = num.toFixed(0)
num = Number(num)
return [num]
}
//------------------------------------------------------------------------------------\\
function randomUid() {
  var charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var randomString = ""
  for (var i = 0; i < 8; i++) {
    if(i == 4 || i == 4) {
      randomString += "-"
    }
    else {
      var randomPoz = Math.floor(Math.random() * charSet.length)
      randomString += charSet.substring(randomPoz, randomPoz + 1)
    }
  }
  return randomString
}
//------------------------------------------------------------------------------------\\
Array.prototype.random = function() {
  return this[Math.floor(this.length * Math.random())];
}
 //------------------------------------------------------------------------------------\\
  function user_id(id) {
    let ids = 0
    if(uid[id]){
      ids = uid[id].id
    }
    return ids;
  }
  //------------------------------------------------------------------------------------\\
  var uptime = { sec: 0, min: 0, hours: 0, days: 0 }
 //------------------------------------------------------------------------------------\\
  setInterval(() => {
    uptime.sec++;
    if (uptime.sec == 60) { uptime.sec = 0; uptime.min += 1; }
    if (uptime.min == 60) { uptime.min = 0; uptime.hours += 1; }
    if (uptime.hours == 24) { uptime.hours = 0; uptime.days += 1; }
  }, 1000);
//------------------------------------------------------------------------------------\\
   function time() {
      let date = new Date();
      let days = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      var times = hours + ':' + minutes + ':' + seconds
      return times;
  }

function time2() {
      let date = new Date();
      let days = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      var times = hours + ':' + minutes
      return times;
  }

function restart() {
 process.exit(-1)
return `Готово`
};

 //------------------------------------------------------------------------------------\\
  function data() {
    var date = new Date();
    let days = date.getDate();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    if (days < 10) days = "0" + days;
    var datas = days + '.' + month + '.2019' ;
    return datas;
  }
 //------------------------------------------------------------------------------------\\

// Утилита
const utils = {
  sp: (int) => {
    int = int.toString();
    return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
  },
  tx: (int) => {
    int = int.toString();
    return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
  },
  rn: (int, fixed) => {
    if (int === null) return null;
    if (int === 0) return '0';
    fixed = (!fixed || fixed < 0) ? 0 : fixed;
    let b = (int).toPrecision(2).split('e'),
      k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
      c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3) ).toFixed(1 + fixed),
      d = c < 0 ? c : Math.abs(c),
      e = d + ['', 'тыс', 'млн', 'млрд', 'трлн'][k];

      e = e.replace(/e/g, '');
      e = e.replace(/\+/g, '');
      e = e.replace(/Infinity/g, 'Бесконечно');

    return e;
  },
  gi: (int) => {
    int = int.toString();

    let text = ``;
    for (let i = 0; i < int.length; i++)
    {
      text += `${int[i]}&#8419;`;
    }

    return text;
  },
  decl: (n, titles) => { return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] },
  random: (x, y) => {
    return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
  },
  pick: (array) => {
    return array[utils.random(array.length - 1)];
  }
}

// ------------------------------------------ \\

function getUnix() {
  return Date.now();
}

//-------------------------------------------------------------------------------------\\

function unixStamp(stamp) {
  let date = new Date(stamp),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours() < 10 ? "0"+date.getHours() : date.getHours(),
    mins = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes(),
    secs = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds();

  return `${day}.${month}.${year}, ${hour}:${mins}:${secs}`;
}

//------------------------------------------------------------------------------------\\

function unixStampLeft(stamp) {
  stamp = stamp / 1000;

  let s = stamp % 60;
  stamp = ( stamp - s ) / 60;

  let m = stamp % 60;
  stamp = ( stamp - m ) / 60;

  let h = ( stamp ) % 24;
  let d = ( stamp - h ) / 24;

  let text = ``;

  if(d > 0) text += Math.floor(d) + " д. ";
  if(h > 0) text += Math.floor(h) + " ч. ";
  if(m > 0) text += Math.floor(m) + " мин. ";
  if(s > 0) text += Math.floor(s) + " с.";

  return text;
}
//----------------------------------------------------------//

function getRandomElement(array) {
return array[getRandomInt(array.lenght - 1)];
}


function getRandomElement(array) {
return array[getRandomInt(array.length - 1)];
}

function getRandomInt(x, y) {
return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
}
