/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var ICON = './images/ic_story_point.png';



// var randomBadgeColor = function () {
//   return ['green', 'yellow', 'red', 'none'][Math.floor(Math.random() * 4)];
// };
// var updateLists = async function (t) {


//   var lists = await t.lists('all');

//   for (const list of lists) {
//     var spcount = 0;

//     var tableID = list.id
//     var cards = list.cards;

//     for (const card of cards) {
//       var cardID = card.id
//       var val = await t.get('board', 'shared', `stati_story_point_value_${cardID}`)

//       valInt = parseInt(val)
//       if (valInt > 0) spcount += valInt
//     }

//     console.log(`spcount for ${list.name} is ${spcount}`)
//   }


// }



// var boardButtonCallback = function (t) {
//   return t.popup({
//     title: 'Popup List',
//     items: [
//       // {
//       //   text: 'Hello fuckers',
//       //   callback: function (t) {
//       //     return t.modal({
//       //       url: './modal.html', // The URL to load for the iframe
//       //       args: { text: 'Hello' }, // Optional args to access later with t.arg('text') on './modal.html'
//       //       accentColor: '#F2D600', // Optional color for the modal header 
//       //       height: 500, // Initial height for iframe; not used if fullscreen is true
//       //       fullscreen: true, // Whether the modal should stretch to take up the whole screen
//       //       callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
//       //       title: 'Hello, Modal!', // Optional title for modal header
//       //       // You can add up to 3 action buttons on the modal header - max 1 on the right side.
//       //       actions: [{
//       //         icon: GRAY_ICON,
//       //         url: 'https://google.com', // Opens the URL passed to it.
//       //         alt: 'Leftmost',
//       //         position: 'left',
//       //       }
//       //       , {
//       //         icon: GRAY_ICON,
//       //         callback: (tr) => tr.popup({ // Callback to be called when user clicks the action button.
//       //           title: 'Settings',
//       //           url: 'settings.html',
//       //           height: 164,
//       //         }),
//       //         alt: 'Second from left',
//       //         position: 'left',
//       //       }, {
//       //         icon: GRAY_ICON,
//       //         callback: () => console.log('🏎'),
//       //         alt: 'Right side',
//       //         position: 'right',
//       //       }],
//       //     })
//       //   }
//       // },
//       // {
//       //   text: 'Hello fuckers',
//       //   callback: function (t) {
//       //     return t.boardBar({
//       //       url: './board-bar.html',
//       //       height: 200
//       //     })
//       //       .then(function () {
//       //         return t.closePopup();
//       //       });
//       //   }
//       // }
//       {
//         text: 'Hello fuckers',
//         callback: function (t) {
//           return t.alert({
//             message: 'Hello fuckers! Go team mobile',
//             duration: 6,
//           });
//         }
//       }

//     ]
//   });
// };
//==================================================================================================================
var getCardBackSection = async function (t, opts) {
  return {
    title: 'StatiStoryPoints',
    icon: ICON,
    content: {
      type: 'iframe',
      url: t.signUrl('./pickCardType.html'),
      height: 230,
    },
    action: {
    }
  };
}

//==================================================================================================================
var getTotalListSPCount = async function (t, list) {
  var spcount = 0;
  var spcount_dev = 0;
  var spcount_evo = 0;
  var number_blank_cards = 0;

  var cards = list.cards;

  for (const card of cards) {
    var cardID = card.id
    // //transition
    // var boardVal = await t.get('board', 'shared', `stati_story_point_value_${cardID}`)
    // if(boardVal)
    // {
    //   await t.set(cardID, 'shared', `stati_story_point_value_${cardID}`, boardVal)
    //   await t.remove('board', 'shared', `stati_story_point_value_${cardID}`)
    // }
    // var boardType = await t.get('board', 'shared', `stati_story_point_card_type_${cardID}`)
    // if(boardType)
    // {
    //   await t.set(cardID, 'shared', `stati_story_point_card_type_${cardID}`, boardType)
    //   await t.remove('board', 'shared', `stati_story_point_card_type_${cardID}`)
    // }
    // //fin transition
    var val = await t.get(cardID, 'shared', `stati_story_point_value_${cardID}`)
    var cardType = await t.get(cardID, 'shared', `stati_story_point_card_type_${cardID}`)
    if (!cardType) cardType = 'dev'

    valInt = parseInt(val)
    if (valInt > 0) {
      spcount += valInt
      if (cardType === 'evo') spcount_evo += valInt
      else spcount_dev += valInt
    }
    else number_blank_cards = number_blank_cards + 1
  }

  if (number_blank_cards > 0) number_blank_cards = number_blank_cards - 1 //la carte total

  return {
    total: spcount,
    dev: spcount_dev,
    evo: spcount_evo,
    blank: number_blank_cards
  }
}

var getListSPLimit = async function (t, list) {
  const id = list.id;
  const limit = await t.get('board', 'shared', `stati_story_point_limit_${id}`);
  const limitEvo = await t.get('board', 'shared', `stati_story_point_limit_evo_${id}`);

  var limitInt = parseInt(limit)
  if (!limitInt) limitInt = 0

  var limitEvoInt = parseInt(limitEvo)
  if (!limitEvoInt) limitEvoInt = 0

  return {
    total: limitInt,
    evo: limitEvoInt
  }
}
var getColorForSP = function (sp, limit) {
  if (!limit || limit < 1) return 'green'
  val = parseInt(sp)
  if (val > limit) return 'red'
  else if (val === limit) return 'yellow'
  else return 'green'
}

var getColorForSP_Zero = function (sp) {

  val = parseInt(sp)
  if (val > 0) return 'pink'
  else return 'green'
}

var getTotalListSPCountBadges = async function (t, opts) {

  var allstuff = await t.getAll();
  console.log('all the data')
  console.log(allstuff)

  var card = await t.card('id', 'name')
  var id = card.id

  var list = await t.list('all');
  var spLimit = await getListSPLimit(t, list)

  var limitTotal = spLimit.total
  var limitEvo = spLimit.evo
  var limitDev = limitTotal - limitEvo

  var savedTotal = await t.get(id, 'shared', `stati_story_point_total_value_${list.id}`);
  var spColor = getColorForSP(savedTotal, limitTotal)

  var savedDev = await t.get(id, 'shared', `stati_story_point_total_value_dev_${list.id}`);
  var devColor = getColorForSP(savedDev, limitDev)

  var savedEvo = await t.get(id, 'shared', `stati_story_point_total_value_evo_${list.id}`);
  var evoColor = getColorForSP(savedEvo, limitEvo)

  var savedBlank = await t.get(id, 'shared', `stati_story_point_total_value_blank_${list.id}`);
  var blankColor = getColorForSP_Zero(savedBlank)

  var totalText = `Total : ${savedTotal}`
  if (limitTotal > 0) totalText = `${totalText} / ${limitTotal}`

  var devText = `DEV : ${savedDev}`
  if (limitDev > 0 && limitEvo > 0) devText = `${devText} / ${limitDev}`

  var evoText = `Évolution: ${savedEvo}`
  if (limitEvo > 0) evoText = `${evoText} / ${limitEvo}`

  var res = [];
  // if (spLimit > 0) res.push({
  //   title: 'Limite',
  //   text: `Limite : ${spLimit}`,
  //   icon: ICON,
  //   color: 'yellow'
  // });
  res.push({
    title: 'Total Story Points',
    text: totalText,
    icon: ICON,
    color: spColor,
  });
  if (savedDev > 0 && savedEvo > 0) res.push({
    title: 'Total Story Points - DEV',
    text: devText,
    icon: ICON,
    color: devColor,
  });
  if (savedEvo > 0) res.push({
    title: 'Total Story Points - Évolution',
    text: evoText,
    icon: ICON,
    color: evoColor,
  });
  if (savedBlank > 0) res.push({
    title: 'Total Story Points - Non évaluées',
    text: `Non évaluée: ${savedBlank}`,
    icon: ICON,
    color: blankColor,
  });
  return res;
}

var getTheTotalsCardFromList = function (list) {
  var cards = list.cards;
  for (const card of cards) {
    if (card.name.indexOf('#') === 0) return card
  }
  return null
}

var updateTotals = async function (t) {
  var list = await t.list('all');
  console.log('the list in update totals');
  console.log(list);

  var spcount = await getTotalListSPCount(t, list);
  var totalsCard = getTheTotalsCardFromList(list)
  if (!totalsCard) return

  var id = totalsCard.id

  //transition
  var savedTotalSPDel = await t.get('board', 'shared', `stati_story_point_total_value_${list.id}`);
  if (savedTotalSPDel) {
    await t.remove('board', 'shared', `stati_story_point_total_value_${list.id}`)
  }
  var savedDevSPDel = await t.get('board', 'shared', `stati_story_point_total_value_dev_${list.id}`);
  if (savedDevSPDel) {
    await t.remove('board', 'shared', `stati_story_point_total_value_dev_${list.id}`)
  }
  var savedEvoSPDel = await t.get('board', 'shared', `stati_story_point_total_value_evo_${list.id}`);
  if (savedEvoSPDel) {
    await t.remove('board', 'shared', `stati_story_point_total_value_evo_${list.id}`)
  }
  var savedBlankDel = await t.get('board', 'shared', `stati_story_point_total_value_blank_${list.id}`);
  if (savedBlankDel) {
    await t.remove('board', 'shared', `stati_story_point_total_value_blank_${list.id}`)
  }
  //fin transition

  var savedTotalSP = await t.get(id, 'shared', `stati_story_point_total_value_${list.id}`);
  var savedDevSP = await t.get(id, 'shared', `stati_story_point_total_value_dev_${list.id}`);
  var savedEvoSP = await t.get(id, 'shared', `stati_story_point_total_value_evo_${list.id}`);
  var savedBlank = await t.get(id, 'shared', `stati_story_point_total_value_blank_${list.id}`);


  if (savedTotalSP !== spcount.total) await t.set(id, 'shared', `stati_story_point_total_value_${list.id}`, spcount.total);
  if (savedDevSP !== spcount.dev) await t.set(id, 'shared', `stati_story_point_total_value_dev_${list.id}`, spcount.dev);
  if (savedEvoSP !== spcount.evo) await t.set(id, 'shared', `stati_story_point_total_value_evo_${list.id}`, spcount.evo);
  if (savedBlank !== spcount.blank) await t.set(id, 'shared', `stati_story_point_total_value_blank_${list.id}`, spcount.blank);
}
var getNormalBadges = async function (t, opts) {

  await updateTotals(t);

  const card = await t.card('id', 'name')
  const id = card.id

  // const logCard = await t.card('all');
  // console.log('card');
  // console.log(logCard);
  // //transition
  // var boardVal = await t.get('board', 'shared', `stati_story_point_value_${id}`)
  // if(boardVal)
  // {
  //   console.log(`removing a value for card ${id}`);
  //   //await t.set(id, 'shared', `stati_story_point_value_${id}`, boardVal)
  //   await t.remove('board', 'shared', `stati_story_point_value_${id}`)
  // }
  // var boardType = await t.get('board', 'shared', `stati_story_point_card_type_${id}`)
  // if(boardType)
  // {
  //   console.log(`removing a type for card ${id}`);
  //   //await t.set(id, 'shared', `stati_story_point_card_type_${id}`, boardType)
  //   await t.remove('board', 'shared', `stati_story_point_card_type_${id}`)
  // }
  // //fin transition

  const sp = await t.get(id, 'shared', `stati_story_point_value_${id}`);
  var spText = sp;
  var spColor = 'green';
  if (!sp || sp < 1) {
    spText = 'À évaluer';
    spColor = 'orange';
  }

  const cardType = await t.get(id, 'shared', `stati_story_point_card_type_${id}`);
  var typeText = 'Dev';
  var typeColor = 'green';
  if (cardType === 'evo') {
    typeText = 'Évolution';
    typeColor = 'blue';
  }


  return [
    {
      title: 'StatiStoryPoints',
      text: spText,
      icon: ICON,
      color: spColor
    },
    {
      title: 'Type',
      text: typeText,
      icon: ICON,
      color: typeColor
    }
  ]
}


var getBadges = async function (t, opts) {

  const card = await t.card('id', 'name')
  const id = card.id




  if (card.name.indexOf('#') === 0) {

    return await getTotalListSPCountBadges(t, opts)
  }
  else {

    return await getNormalBadges(t, opts)
  }


};
//==================================================================================================================
var getCardButtons = async function (t, opts) {



  const card = await t.card('name')

  if (card.name.indexOf('#') === 0) {
    return [
      {
        icon: ICON,
        text: 'Générer une image de couverture',
        callback: statStoryPointsTotalButtonCallback
      }
    ]
  }
  else {
    return [
      {
        icon: ICON,
        text: 'StatiStoryPoints',
        callback: statiStoryPointsButtonCallback
      }

    ]
  }
}
var statiStoryPointsButtonCallback = function (t, opts) {
  var items = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89'].map(function (fibItem) {

    return {
      text: fibItem,
      callback: function (t) {

        t.card('id')
          .get('id')
          .then(function (id) { t.set('card', 'shared', `stati_story_point_value_${id}`, fibItem) })
          .then(function () {
            console.log('value set');

          });

        return t.closePopup();

      }
    };
  });


  return t.popup({
    title: 'Choisir la complexité',
    items: items, // Trello will search client-side based on the text property of the items

  });
};

var statStoryPointsTotalButtonCallback = async function (t, opts) {
  var list = await t.list('all');
  var spcount = await getTotalListSPCount(t, list)



  await t.attach({
    name: 'Recap image', // optional
    url: `https://fakeimg.pl/300x100/30bcd1/ffffff?text=${spcount.total}&font=bebas&font_size=80` // required
  });
}
//==================================================================================================================

var getListActions = async function (t) {

  const list = await t.list('name', 'id');
  return [
    {
      text: "Définir une limite pour cette liste",
      callback: listLimitCallback
    }
  ];

}

var listLimitCallback = async function (t) {

  t.popup({
    title: 'Choisir',
    url: './picklimit.html',
    height: 184
  });

}


TrelloPowerUp.initialize({

  'card-badges': function (t, options) {
    return getBadges(t, options)
  },
  'card-buttons': function (t, options) {
    return getCardButtons(t, options)
  },
  'card-detail-badges': function (t, options) {
    return getBadges(t, options)
  },
  'list-actions': function (t) {
    return getListActions(t)
  },
  'card-back-section': function (t, options) {
    return getCardBackSection(t, options)
  },
  'authorization-status': function (t, options) {
    return t.get('member', 'private', 'token')
      .then(function (token) {
        if (token) {
          return { authorized: true };
        }
        return { authorized: false };
      });
  },
  'show-authorization': function (t, options) {
    let trelloAPIKey = '288492918a8be959e6b9aadb9bd83f3f';
    if (trelloAPIKey) {
      return t.popup({
        title: 'My Auth Popup',
        args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
        url: './authorize.html', // Check out public/authorize.html to see how to ask a user to auth
        height: 140,
      });
    } else {
      console.log("🙈 Looks like you need to add your API key to the project!");
    }
  }
});

console.log('Loaded by: ' + document.referrer);
