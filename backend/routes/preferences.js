
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
    const preferences = await prefs.find();
    res.json( { status: 200, prefs:preferences } );
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
        const prefResponse = await prefs.find({});        
        const allFulfilled = result.every((r) => r.status === 'fulfilled');
        res.status(allFulfilled ? 200 : 500).send(allFulfilled ? {status:'200',prefs: prefResponse} : '500');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('500');
    }
});

router.post('/setpreferences_V2', async (req, res) => {
    const newPreferences = req.body;
    const prefKeys = Object.keys(newPreferences);
    const currentValuse = await prefs.find({});
    // console.log(currentValuse);
    
    try {
        let newPref;
        const promiseSetOne = prefKeys.map(async (key) => {
            // console.log(key);
            
           const foundValue = currentValuse.find(pref=>pref.id == key);
            console.log(foundValue);
            
            if( typeof newPreferences[key] === 'string' || 
                typeof newPreferences[key] === 'number' ||
                typeof newPreferences[key] === 'boolean'
            ){
                newPref = {
                    'id':key,
                    value: newPreferences[key]
                }
                await prefs.findOneAndUpdate({'id':key},newPref,{upsert: true})
            }
            else if(typeof newPreferences[key] === 'object' && newPreferences[key].length >= 0){
                 newPref = {
                    'id':key,
                    value: foundValue ? [...foundValue.value,...newPreferences[key]]: [...newPreferences[key]]
                }
                await prefs.findOneAndUpdate({'id':key},newPref,{upsert: true})

            } 
            else{
                newPref = {
                    'id':key,
                    value:{...newPreferences[key]}
                }
                await prefs.findOneAndUpdate({'id':key},newPref,{upsert: true})
            }  
        });
        
        const result = await Promise.allSettled(promiseSetOne);
        const prefResponse = await prefs.find({});        
        const allFulfilled = result.every((r) => r.status === 'fulfilled');
        res.status(allFulfilled ? 200 : 500).send(allFulfilled ? {status:'200',prefs: prefResponse} : '500');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('500');
    }
});

router.delete('/deleteearlyClockoutReason', async(req,res)=>{
    const itemToDelete = req.body.reason
    const currentLeavePrefs = await prefs.findOne({id:'earlyLeaveReasons'})
    console.log(itemToDelete,currentLeavePrefs);
    
    const filterdLeavePrefs = currentLeavePrefs.value.filter((pref)=> pref !== itemToDelete)
    await prefs.findOneAndUpdate({id:'earlyLeaveReasons'},{value:[...filterdLeavePrefs]})
    res.send({status:200,prefs:await prefs.find({})})
});


router.delete('/deleteprefs', async(req,res)=>{
    await prefs.findOneAndDelete({id:'earlyLeaveReasons'})
    res.send('done')
})
module.exports = router;
