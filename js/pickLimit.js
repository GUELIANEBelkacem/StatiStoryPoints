/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var statiPickLimitEntry = document.getElementById('statipicklimit');

t.render(async function () {
    const list = await t.lists('id', 'name');
    const id = list.id;

    const currentLimit = await t.get('board', 'shared', `stati_story_point_limit_${id}`);
    statiPickLimitEntry.value = currentLimit;

    return t.sizeTo('#content').done();

});

document.getElementById('save').addEventListener('click', async function () {

    const list = await t.list('id', 'name');
    const id = list.id;

    await t.set('board', 'shared', `stati_story_point_limit_${id}`, statiPickLimitEntry.value);

    return t.closePopup();
})
