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


var randomBadgeColor = function () {
  return ['green', 'yellow', 'red', 'none'][Math.floor(Math.random() * 4)];
};

var getBadges = function (t) {
  return t.card('name')
    .get('name')
    .then(function (cardName) {
      console.log('We just loaded the card name for fun: ' + cardName);

      return [{
        // dynamic badges can have their function rerun after a set number
        // of seconds defined by refresh. Minimum of 10 seconds.
        dynamic: function () {
          // we could also return a Promise that resolves to this as well if we needed to do something async first
          return {
            title: 'Detail Badge', // for detail badges only
            text: 'Dynamic ' + (Math.random() * 100).toFixed(0).toString(),
            icon: ICON, // for card front badges only
            color: randomBadgeColor(),
            refresh: 10 // in seconds
          };
        }
      }, {
        // its best to use static badges unless you need your badges to refresh
        // you can mix and match between static and dynamic
        title: 'Detail Badge', // for detail badges only
        text: 'Static',
        icon: ICON, // for card front badges only
        color: null
      }, {
        // card detail badges (those that appear on the back of cards)
        // also support callback functions so that you can open for example
        // open a popup on click
        title: 'Popup Detail Badge', // for detail badges only
        text: 'Popup',
        icon: ICON, // for card front badges only
        callback: function (context) { // function to run on click
          return context.popup({
            title: 'Card Detail Badge Popup',
            url: './settings.html',
            height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
          });
        }
      }, {
        // or for simpler use cases you can also provide a url
        // when the user clicks on the card detail badge they will
        // go to a new tab at that url
        title: 'URL Detail Badge', // for detail badges only
        text: 'URL',
        icon: ICON, // for card front badges only
        url: 'https://trello.com/home',
        target: 'Trello Landing Page' // optional target for above url
      }];
    });
};

var boardButtonCallback = function (t) {
  return t.popup({
    title: 'Popup List',
    items: [
      // {
      //   text: 'Hello fuckers',
      //   callback: function (t) {
      //     return t.modal({
      //       url: './modal.html', // The URL to load for the iframe
      //       args: { text: 'Hello' }, // Optional args to access later with t.arg('text') on './modal.html'
      //       accentColor: '#F2D600', // Optional color for the modal header 
      //       height: 500, // Initial height for iframe; not used if fullscreen is true
      //       fullscreen: true, // Whether the modal should stretch to take up the whole screen
      //       callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
      //       title: 'Hello, Modal!', // Optional title for modal header
      //       // You can add up to 3 action buttons on the modal header - max 1 on the right side.
      //       actions: [{
      //         icon: GRAY_ICON,
      //         url: 'https://google.com', // Opens the URL passed to it.
      //         alt: 'Leftmost',
      //         position: 'left',
      //       }
      //       , {
      //         icon: GRAY_ICON,
      //         callback: (tr) => tr.popup({ // Callback to be called when user clicks the action button.
      //           title: 'Settings',
      //           url: 'settings.html',
      //           height: 164,
      //         }),
      //         alt: 'Second from left',
      //         position: 'left',
      //       }, {
      //         icon: GRAY_ICON,
      //         callback: () => console.log('🏎'),
      //         alt: 'Right side',
      //         position: 'right',
      //       }],
      //     })
      //   }
      // },
      // {
      //   text: 'Hello fuckers',
      //   callback: function (t) {
      //     return t.boardBar({
      //       url: './board-bar.html',
      //       height: 200
      //     })
      //       .then(function () {
      //         return t.closePopup();
      //       });
      //   }
      // }
      {
        text: 'Hello fuckers',
        callback: function (t) {
          return t.alert({
            message: 'Hello fuckers! Go team mobile',
            duration: 6,
          });
        }
      }

    ]
  });
};

var cardButtonCallback = function (t, opts) {
  var items = ['1', '2', '3', '5', '8', '13', '21', '34', '55'].map(function (fibItem) {

    return {
      text: fibItem,
      callback: function (t) {

        console.log('object t');
        console.log(t);
        console.log('object opts');
        console.log(opts);

        console.log('t.card()');
        console.log(t.card());
        console.log('t.card(name)');
        console.log(t.card('name'))
        console.log('t.card(id, name)');
        console.log(t.card('id', 'name'))
        console.log('t.card(all)');
        console.log(t.card('all'));

        t.card('name')
          .get('name')
          .then(function (cardName) {
            console.log('Heres the card name: ' + cardName);
          });

        return t.set('card', 'private', 'storyPoints', fibItem)
          .then(function () {
            return t.closePopup();
          });
      }
    };
  });


  return t.popup({
    title: 'Choisir la complexité',
    items: items, // Trello will search client-side based on the text property of the items

  });


};

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

  //   // we will just claim urls for Yellowstone
  //   var claimed = options.entries.filter(function (attachment) {
  //     return attachment.url.indexOf('http://www.nps.gov/yell/') === 0;
  //   });

  //   // you can have more than one attachment section on a card
  //   // you can group items together into one section, have a section
  //   // per attachment, or anything in between.
  //   if (claimed && claimed.length > 0) {
  //     // if the title for your section requires a network call or other
  //     // potentially length operation you can provide a function for the title
  //     // that returns the section title. If you do so, provide a unique id for
  //     // your section
  //     return [{
  //       id: 'Yellowstone', // optional if you aren't using a function for the title
  //       claimed: claimed,
  //       icon: GLITCH_ICON,
  //       title: 'Example Attachment Section: Yellowstone',
  //       content: {
  //         type: 'iframe',
  //         url: t.signUrl('./section.html', { arg: 'you can pass your section args here' }),
  //         height: 230
  //       }
  //     }];
  //   } else {
  //     return [];
  //   }
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
  'board-buttons': function (t, options) {
    return [{
      // we can either provide a button that has a callback function
      // that callback function should probably open a popup, overlay, or boardBar
      icon: ICON,
      text: 'StatiStoryPoints',
      callback: boardButtonCallback
    }, {
      // or we can also have a button that is just a simple url
      // clicking it will open a new tab at the provided url
      icon: ICON,
      text: 'URL',
      url: 'https://trello.com/inspiration',
      target: 'Inspiring Boards' // optional target for above url
    }];
  },
  'card-badges': function (t, options) {
    return getBadges(t);
  },
  'card-buttons': function (t, options) {
    return [{
      // usually you will provide a callback function to be run on button click
      // we recommend that you use a popup on click generally
      icon: ICON, // don't use a colored icon here
      text: 'StatiStoryPoints',
      callback: cardButtonCallback
    }];
  },
  'card-detail-badges': function (t, options) {
    return getBadges(t);
  },
  'card-from-url': function (t, options) {
    // options.url has the url in question
    // if we know cool things about that url we can give Trello a name and desc
    // to use when creating a card. Trello will also automatically add that url
    // as an attachment to the created card
    // As always you can return a Promise that resolves to the card details

    return new Promise(function (resolve) {
      resolve({
        name: '💻 ' + options.url + ' 🤔',
        desc: 'This Power-Up knows cool things about the attached url'
      });
    });

    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
  'format-url': function (t, options) {
    // options.url has the url that we are being asked to format
    // in our response we can include an icon as well as the replacement text

    return {
      icon: ICON, // don't use a colored icon here
      text: '👉 ' + options.url + ' 👈'
    };

    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
  'show-settings': function (t, options) {
    // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
    // what should Trello show. We highly recommend the popup in this case as
    // it is the least disruptive, and fits in well with the rest of Trello's UX
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
    });
  },

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
(function () {

  Trello.board.get().then((board) => {

    const lists = board.lists

    lists.forEach(async (list) => {


      console.log(list)


    })

  })
}())