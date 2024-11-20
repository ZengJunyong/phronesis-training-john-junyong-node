import 'dotenv/config'
import express from 'express';
import RebillyAPI from 'rebilly-js-sdk';

const REBILLY_API_SECRET_KEY = process.env.API_KEY;
const REBILLY_WEBSITE_ID = "casino-deposit-form";
const REBILLY_ORGANIZATION_ID = 'phoronesis-john-junyong';
const api = RebillyAPI({
    sandbox: true,
    organizationId: REBILLY_ORGANIZATION_ID,
    apiKey: REBILLY_API_SECRET_KEY,
});

const router = express.Router();

router.get('/get', async (req, res) => {
    const {param} = req.query;
    try {
        res.json({param});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/post', async (req, res) => {
    const {param} = req.body;
    try {
        res.json({param});
    } catch (err) {
        res.status(500).json({"error": err.message});
    }
});

router.post('/invoices', async (req, res) => {
    const invoices = await api.invoices.getAll({filter: `customerId:cus_01J63Y0C1XZ5Q3M4G9W246KX2P`});
    res.json(invoices);
});

router.post('/deposit-with-strategy', async (req, res) => {
    const {currency, strategyId} = req.body;
    const customerId = 'cus_01JBEA7J0YR58WCC06R0TAPCE5';
    try {
        const {fields: {token: exchangeToken}} = await api.customerAuthentication.login({
            data: {
                mode: "passwordless",
                customerId,
            },
        });
        const {fields: {token}} = await api.customerAuthentication.exchangeToken({
            token: exchangeToken,
            data: {
                acl: [
                    {
                        scope: {
                            organizationId: [REBILLY_ORGANIZATION_ID],
                        },
                        permissions: [
                            "PostToken",
                            "PostDigitalWalletValidation",
                            "StorefrontGetAccount",
                            "StorefrontPatchAccount",
                            "StorefrontPostPayment",
                            "StorefrontGetTransactionCollection",
                            "StorefrontGetTransaction",
                            "StorefrontGetPaymentInstrumentCollection",
                            "StorefrontPostPaymentInstrument",
                            "StorefrontGetPaymentInstrument",
                            "StorefrontPatchPaymentInstrument",
                            "StorefrontPostPaymentInstrumentDeactivation",
                            "StorefrontGetWebsite",
                            "StorefrontGetInvoiceCollection",
                            "StorefrontGetInvoice",
                            "StorefrontGetProductCollection",
                            "StorefrontGetProduct",
                            "StorefrontPostReadyToPay",
                            "StorefrontGetPaymentInstrumentSetup",
                            "StorefrontPostPaymentInstrumentSetup",
                            "StorefrontGetDepositRequest",
                            "StorefrontGetDepositStrategy",
                            "StorefrontPostDeposit",
                        ],
                    },
                ],
                customClaims: {
                    websiteId: REBILLY_WEBSITE_ID,
                },
            },
        });
        const {fields: {id: depositRequestId}} = await api.depositRequests.create({
            data: {
                websiteId: REBILLY_WEBSITE_ID,
                customerId,
                currency,
                strategyId,
            },
        });
        res.json({token, depositRequestId});
    } catch (err) {
        console.log(err)
        res.status(500).json({"error": err.message});
    }
});

router.post('/payout-request', async (req, res) => {
    const { amount, currency } = req.body;
    const customerId = 'cus_01JBEA7J0YR58WCC06R0TAPCE5';
    try {
        const {fields: {token: exchangeToken}} = await api.customerAuthentication.login({
            data: {
                mode: "passwordless",
                customerId,
            },
        });
        const {fields: {token}} = await api.customerAuthentication.exchangeToken({
            token: exchangeToken,
            data: {
                acl: [
                    {
                        scope: {
                            organizationId: [REBILLY_ORGANIZATION_ID],
                        },
                        permissions: [
                            "PostToken",
                            "StorefrontGetPaymentInstrumentCollection",
                            "StorefrontPostPaymentInstrument",
                            "StorefrontGetPaymentInstrument",
                            "StorefrontPatchPaymentInstrument",
                            "StorefrontGetAccount",
                            "StorefrontGetWebsite",
                            "StorefrontPostReadyToPay",
                            "StorefrontGetPayoutRequestCollection",
                            "StorefrontGetPayoutRequest",
                            "StorefrontPatchPayoutRequest",
                            "StorefrontPostReadyToPayout",

                        ],
                    },
                ],
                customClaims: {
                    websiteId: REBILLY_WEBSITE_ID,
                },
            },
        });
        const {fields: {id: payoutRequestId}} = await api.payoutRequests.create({
            data: {
                websiteId: REBILLY_WEBSITE_ID,
                customerId,
                currency,
                amount,
            },
        });
        res.json({token, payoutRequestId});
    } catch (err) {
        console.log(err)
        res.status(500).json({"error": err.message});
    }
});

export default router;
