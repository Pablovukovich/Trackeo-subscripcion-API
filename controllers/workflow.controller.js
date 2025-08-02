import dayjs from 'dayjs';

import { createRequire } from 'module';
import Subscripcion from '../models/subscripcion.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7,5,2,1];


const require = createRequire(import.meta.url)

const { serve} = require('@upstash/workflow/express')

export const sendReminders = serve( async (context)=>{
    const { subscripcionId } = context.requestPayload;

    const subscripcion = await fetchSubscripcion(context, subscripcionId)
    if(!subscripcion || subscripcion.status !== 'active') return;

    const renovarFecha = dayjs(subscripcion.renovarFecha);

    if(renovarFecha.isBefore(dayjs())){
        console.log(`la fecha de renovacion ha pasado por la subscripcion : ${subscripcionId}. Stop Workflow`);
        return
    }

    for(daysBefore of REMINDERS){
        const reminderDate = renovarFecha.sustract(daysBefore, 'day')

        if(reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context, `Reminder ${daysBefore}days before`, reminderDate)
        }
         await sleepUntilReminder(context, `Reminder ${daysBefore}days before`)

    }
})




const fetchSubscripcion = async (context, subscripcionId) =>{
    return await context.run('get subscripcion', async ()=>{
        return Subscripcion.findById(subscripcionId).populate('user', 'name email')
    })
}

const sleepUntilReminder = async (context, label, date) =>{
    console.log(`Sleeping hasta ${label} reminder en ${date}`)
    await context.sleepUntil(label, date.todDate())
}

const triggerRiminder = async (context, label, subscription)=>{
    return await context.run(label, async ()=>{
        console.log(`provocar ${label} reminder`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: reminder.label.subscription
        })
    })
}