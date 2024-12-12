/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var cardTypeSelect = document.getElementById('card-type-select');

t.render(async function () {
    const card = await t.card('id', 'name');
    const id = card.id;

    const currentType = await t.get('card', 'shared', `stati_story_point_card_type_${id}`);
    if (!currentType) {
        await t.set('card', 'shared', `stati_story_point_card_type_${id}`, 'dev');
        currentType = 'dev';
    }
    cardTypeSelect.value = currentType;

    return t.sizeTo('#content').done();
});

document.getElementById('card-type-select').addEventListener('change', async function () {

    const card = await t.card('id', 'name');
    const id = card.id;

    await t.set('card', 'shared', `stati_story_point_card_type_${id}`, cardTypeSelect.value);

    return;
})
