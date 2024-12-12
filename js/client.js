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

  var cards = list.cards;

  for (const card of cards) {
    var cardID = card.id
    var val = await t.get('board', 'shared', `stati_story_point_value_${cardID}`)
    var cardType = await t.get('board', 'shared', `stati_story_point_card_type_${cardID}`)
    if (!cardType) cardType = 'dev'

    valInt = parseInt(val)
    if (valInt > 0) {
      spcount += valInt
      if (cardType === 'evo') spcount_evo += valInt
      else spcount_dev += valInt
    }
  }

  return {
    total: spcount,
    dev: spcount_dev,
    evo: spcount_evo
  }
}

var getListSPLimit = async function (t, list) {
  const id = list.id;
  const limit = await t.get('board', 'shared', `stati_story_point_limit_${id}`);

  limitInt = parseInt(limit)
  if (limitInt > 0) return limitInt;
  else return 0;
}
var getColorForSP = function (sp, limit) {
  if (!limit || limit < 1) return 'green'
  val = parseInt(sp)
  if (val > limit) return 'red'
  else if (val === limit) return 'yellow'
  else return 'green'
}

var getTotalListSPCountBadges = async function (t, opts) {

  var list = await t.list('all');
  var spLimit = await getListSPLimit(t, list)

  var savedTotal = await t.get('board', 'shared', `stati_story_point_total_value_${list.id}`);
  var spColor = getColorForSP(savedTotal, spLimit)

  var savedDev = await t.get('board', 'shared', `stati_story_point_total_value_dev_${list.id}`);
  var devColor = getColorForSP(savedDev, spLimit)

  var savedEvo = await t.get('board', 'shared', `stati_story_point_total_value_evo_${list.id}`);
  var evoColor = getColorForSP(savedEvo, spLimit)

  var res = [];
  if (spLimit > 0) res.push({
    title: 'Limite',
    text: `Limite : ${spLimit}`,
    icon: ICON,
    color: 'yellow'
  });
  res.push({
    title: 'Total Story Points',
    text: `Total : ${savedTotal}`,
    icon: ICON,
    color: spColor,
  });
  if (savedDev > 0) res.push({
    title: 'Total Story Points - DEV',
    text: `Total - DEV : ${savedDev}`,
    icon: ICON,
    color: devColor,
  });
  if (savedEvo > 0) res.push({
    title: 'Total Story Points - Évolution',
    text: `Total - Évolution: ${savedEvo}`,
    icon: ICON,
    color: evoColor,
  });
  return res;
}

var updateTotals = async function (t) {
  var list = await t.list('all');

  var spcount = await getTotalListSPCount(t, list);


  var savedTotalSP = await t.get('board', 'shared', `stati_story_point_total_value_${list.id}`);
  var savedDevSP = await t.get('board', 'shared', `stati_story_point_total_value_dev_${list.id}`);
  var savedEvoSP = await t.get('board', 'shared', `stati_story_point_total_value_evo_${list.id}`);


  if (savedTotalSP !== spcount.total) await t.set('board', 'shared', `stati_story_point_total_value_${list.id}`, spcount.total);
  if (savedDevSP !== spcount.dev) await t.set('board', 'shared', `stati_story_point_total_value_dev_${list.id}`, spcount.dev);
  if (savedEvoSP !== spcount.evo) await t.set('board', 'shared', `stati_story_point_total_value_evo_${list.id}`, spcount.evo);
}
var getNormalBadges = async function (t, opts) {

  await updateTotals(t);

  const card = await t.card('id', 'name')
  const id = card.id

  const sp = await t.get('board', 'shared', `stati_story_point_value_${id}`);
  var spText = sp;
  var spColor = 'green';
  if (!sp || sp < 1) {
    spText = 'À évaluer';
    spColor = 'orange';
  }

  const cardType = await t.get('board', 'shared', `stati_story_point_card_type_${id}`);
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

  console.log('making a choice');


  if (card.name.indexOf('#') === 0) {
    console.log('choosing total');
    return await getTotalListSPCountBadges(t, opts)
  }
  else {
    console.log('choosing normal');
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
          .then(function (id) { t.set('board', 'shared', `stati_story_point_value_${id}`, fibItem) })
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

  console.log("options");
  console.log(opts);
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

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  // NOTE about asynchronous responses
  // If you need to make an asynchronous request or action before you can reply to Trello
  // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
  // The Promise should resolve to the object type that is expected to be returned
  // 'attachment-sections': function (t, options) {
  //   // options.entries is a list of the attachments for this card
  //   // you can look through them and 'claim' any that you want to
  //   // include in your section.

  //   // console.log('attachment-sections');
  //   // console.log(options);
  //   // // we will just claim urls for Yellowstone
  //   var claimed = options.entries.filter(function (attachment) {
  //     return attachment.url.indexOf('https://fakeimg.pl/') === 0;
  //   });

  //   // // you can have more than one attachment section on a card
  //   // // you can group items together into one section, have a section
  //   // // per attachment, or anything in between.
  //   // if (claimed && claimed.length > 0) {
  //   //   // if the title for your section requires a network call or other
  //   //   // potentially length operation you can provide a function for the title
  //   //   // that returns the section title. If you do so, provide a unique id for
  //   //   // your section
  //   //   return [{
  //   //     id: 'testtest', // optional if you aren't using a function for the title
  //   //     claimed: claimed,
  //   //     icon: ICON,
  //   //     title: 'StatiStoryPoints Section',
  //   //     content: {
  //   //       type: 'iframe',
  //   //       url: t.signUrl('./section.html', { arg: 'you can pass your section args here' }),
  //   //       height: 230
  //   //     }
  //   //   }];
  //   // } else {
  //   //   return [];
  //   // }
  //   return [
  //     {
  //       id: 'testtest', // optional if you aren't using a function for the title
  //       claimed: options.entries,
  //       icon: ICON,
  //       title: 'StatiStoryPoints Section',
  //       content: {
  //         type: 'image',
  //         url: 'https://fakeimg.pl/600x400/a65858/543939?text=Hello',
  //         height: 230
  //       }
  //     }
  //   ];
  // },
  // 'attachment-thumbnail': function (t, options) {
  //   // options.url has the url of the attachment for us
  //   // return an object (or a Promise that resolves to it) with some or all of these properties:
  //   // url, title, image, modified (Date), created (Date), createdBy, modifiedBy

  //   // You should use this if you have useful information about an attached URL but it
  //   // doesn't warrant pulling it out into a section via the attachment-sections capability
  //   // for example if you just want to show a preview image and give it a better name
  //   // then attachment-thumbnail is the best option
  //   return {
  //     url: options.url,
  //     title: '👉 ' + options.url + ' 👈',
  //     image: {
  //       url: GLITCH_ICON,
  //       logo: true // false if you are using a thumbnail of the content
  //     },
  //   };

  //   // if we don't actually have any valuable information about the url
  //   // we can let Trello know like so:
  //   // throw t.NotHandled();
  // },
  // 'board-buttons': function (t, options) {
  //   return [{
  //     // we can either provide a button that has a callback function
  //     // that callback function should probably open a popup, overlay, or boardBar
  //     icon: ICON,
  //     text: 'StatiStoryPoints',
  //     callback: boardButtonCallback
  //   }, {
  //     // or we can also have a button that is just a simple url
  //     // clicking it will open a new tab at the provided url
  //     icon: ICON,
  //     text: 'URL',
  //     url: 'https://trello.com/inspiration',
  //     target: 'Inspiring Boards' // optional target for above url
  //   }];
  // },
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
  // 'card-from-url': function (t, options) {
  //   // options.url has the url in question
  //   // if we know cool things about that url we can give Trello a name and desc
  //   // to use when creating a card. Trello will also automatically add that url
  //   // as an attachment to the created card
  //   // As always you can return a Promise that resolves to the card details

  //   return new Promise(function (resolve) {
  //     resolve({
  //       name: '💻 ' + options.url + ' 🤔',
  //       desc: 'This Power-Up knows cool things about the attached url'
  //     });
  //   });

  //   // if we don't actually have any valuable information about the url
  //   // we can let Trello know like so:
  //   // throw t.NotHandled();
  // },
  // 'format-url': function (t, options) {
  //   // options.url has the url that we are being asked to format
  //   // in our response we can include an icon as well as the replacement text

  //   return {
  //     icon: ICON, // don't use a colored icon here
  //     text: '👉 ' + options.url + ' 👈'
  //   };

  //   // if we don't actually have any valuable information about the url
  //   // we can let Trello know like so:
  //   // throw t.NotHandled();
  // },
  // 'show-settings': function (t, options) {
  //   // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
  //   // what should Trello show. We highly recommend the popup in this case as
  //   // it is the least disruptive, and fits in well with the rest of Trello's UX
  //   return t.popup({
  //     title: 'Settings',
  //     url: './settings.html',
  //     height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
  //   });
  // },

  /*        
      
      🔑 Authorization Capabiltiies 🗝
      
      The following two capabilities should be used together to determine:
      1. whether a user is appropriately authorized
      2. what to do when a user isn't completely authorized
      
  */
  'authorization-status': function (t, options) {
    // Return a promise that resolves to an object with a boolean property 'authorized' of true or false
    // The boolean value determines whether your Power-Up considers the user to be authorized or not.

    // When the value is false, Trello will show the user an "Authorize Account" options when
    // they click on the Power-Up's gear icon in the settings. The 'show-authorization' capability
    // below determines what should happen when the user clicks "Authorize Account"

    // For instance, if your Power-Up requires a token to be set for the member you could do the following:
    return t.get('member', 'private', 'token')
      .then(function (token) {
        if (token) {
          return { authorized: true };
        }
        return { authorized: false };
      });
    // You can also return the object synchronously if you know the answer synchronously.
  },
  'show-authorization': function (t, options) {
    // Returns what to do when a user clicks the 'Authorize Account' link from the Power-Up gear icon
    // which shows when 'authorization-status' returns { authorized: false }.

    // If we want to ask the user to authorize our Power-Up to make full use of the Trello API
    // you'll need to add your API from trello.com/app-key below:
    let trelloAPIKey = '288492918a8be959e6b9aadb9bd83f3f';
    // This key will be used to generate a token that you can pass along with the API key to Trello's
    // RESTful API. Using the key/token pair, you can make requests on behalf of the authorized user.

    // In this case we'll open a popup to kick off the authorization flow.
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
