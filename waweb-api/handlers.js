import axiosInstance from './axiosInstance.js';
import respondBuilderText from './respondBuilder.js';
import dotenv from 'dotenv';

dotenv.config();

const { WEBHOOK_VERIFY_TOKEN } = process.env;

const userStates = new Map();

const getUserState = (userId) => userStates.get(userId) || { currentState: "" };
const setUserState = (userId, state) => userStates.set(userId, state);

export const handleWebhookPost = async (req, res) => {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message?.type === 'text' || message?.type === 'button') {
        const businessPhoneNumberId = req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
        const userId = message.from;

        console.log('===========User ID=========================');
        console.log(userId);
        console.log('====================================');

        const userState = getUserState(userId);
        try {
            console.log('==================Balasan User==================');
            console.log(message?.type !== 'button' ? message.text.body : message.button.text);
            console.log('====================================');
            const response = await respondBuilderText(
                message?.type !== 'button' ? message.text.body : message.button.text,
                userState,
                userId
            );

            await axiosInstance.post(`${businessPhoneNumberId}/messages`, {
                messaging_product: 'whatsapp',
                to: userId,
                text: { body: response.text },
                context: { message_id: message.id },
            });

            setUserState(userId, { currentState: response.nextState });
            res.sendStatus(200);
        } catch (error) {
            console.error('Error processing message:', error);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(200);
    }
};

export const handleWebhookGet = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        res.status(200).send(challenge);
        console.log('Webhook verified successfully!');
    } else {
        res.sendStatus(403);
    }
};

export const handleRootGet = (req, res) => {
    res.send(`<pre>Nothing to see here.\nCheckout README.md to start.</pre>`);
};
