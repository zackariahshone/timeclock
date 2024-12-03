const router = require('express').Router();
const prefs = require('../dbconnection/models/Preference.js')
const preferences = [
    {
        id: 'Auto Clock Out',
        type: 'number',
        default: 3,
        key: 'time',
        value: 0,
        options: [
            {
                type: 'dropdown',
                id: 'timeOfDay',
                options: ['AM', 'PM'],
                value: 'PM',
                key: 'timeOfDay'
            }
        ]
    },
    {
        id: 'Target Hours',
        type: 'number',
        default: 5,
        key: 'time',
        value: 0,
        options: [
            {
                type: 'dropdown',
                id: 'timeOfDay',
                options: ['AM', 'PM'],
                key: 'timeOfDay',
                value: 'PM'

            }
        ]
    },
    {
        id: 'Lock Editing',
        type: 'checkbox',
        default: false
    }
]

router.get('/getpreferences', async (req, res) => {
    // console.log(req.body);
    const preferences = await prefs.find();
    res.json({ status: 200, preferences });
});

router.post('/setpreferences', async (req, res) => {
    const newPreferences = req.body;
    const prefKeys = Object.keys(newPreferences);

    try {
        const promiseSetOne = prefKeys.map(async (key) => {
            const options = newPreferences[key]?.options;
            const preftoUpdate = await prefs.findOne({ id: key });

            preftoUpdate.value = newPreferences[key].value;
            if (options) {
                const allOptionPromises = options.map(async (optionVal) => {
                    const keys = Object.keys(optionVal);
                    keys.forEach((key) => {
                        const itemToUpdate = preftoUpdate.options.find((pref) => pref.key == key);
                        if (itemToUpdate) {
                            itemToUpdate.value = Object.values(optionVal)[0];
                        }
                    });
                    return preftoUpdate.save();
                });
                await Promise.all(allOptionPromises);
            } else {
                await preftoUpdate.save();
            }
        });

        const result = await Promise.allSettled(promiseSetOne);

        const allFulfilled = result.every((r) => r.status === 'fulfilled');
        res.status(allFulfilled ? 200 : 500).send(allFulfilled ? '200' : '500');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('500');
    }
});



module.exports = router;
