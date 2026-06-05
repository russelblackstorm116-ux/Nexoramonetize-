import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionTier, UserSession, SavedChat, SavedPlan, MonetizationChannel } from '../types';

export type Language = 'en' | 'fr';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateChannel: (channel: MonetizationChannel) => MonetizationChannel;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Brand
    'nav.brand.name': 'Nexora Monetize',
    'nav.brand.tag': 'Passive Income Suite',
    'nav.tab.dashboard': 'Dashboard',
    'nav.tab.guides': 'Channel Guides',
    'nav.tab.chat': 'AI Advisor',
    'nav.tab.admin': 'Admin Tools',
    'nav.action.login': 'Login',
    'nav.action.start': 'Start Earning',
    'nav.action.signed_in_as': 'Signed in as',
    'nav.action.disconnect': 'Disconnect Session',
    'nav.action.logout': 'Logout session',

    // Landing Page
    'landing.hero.badge': 'AI-powered Revenue Engine',
    'landing.hero.title1': 'Find Opportunities.',
    'landing.hero.title2': 'Build Income.',
    'landing.hero.title3': 'Grow Faster.',
    'landing.hero.subtitle': 'The all-in-one suite to fast-track digital earnings. Unlock a custom AI Monetization Advisor fueled by Gemini, dynamic interactive calculator worksheets, step-by-step channel blueprints, and ready-to-inject revenue presets.',
    'landing.hero.dashboard_btn': 'Go to Advisor Dashboard',
    'landing.hero.start_btn': 'Start Modeling Free',
    'landing.hero.signin_btn': 'Sign In / Create Account',
    'landing.calc.badge': 'Interactive Revenue Sandbox',
    'landing.calc.title': 'Estimate Your Channels',
    'landing.calc.subtitle': 'Select a digital monetization channel to instantly gauge index potential.',
    'landing.calc.traffic': 'Est. Traffic Volume',
    'landing.calc.estimate': 'Monthly Revenue Estimate',
    'landing.calc.rpm_note': 'Calculated with industry average RPMS (Revenue Per Mille).',
    'landing.calc.save': 'Save Worksheet Plan',
    'landing.calc.pro_note': 'Create a free account to customize parameters and unlock deep AI insights.',
    'landing.feature.title': 'Features engineered for your success',
    'landing.feature.p1_title': 'Worksheets & Models',
    'landing.feature.p1_desc': 'Tweak metrics, adjust traffic scales, and calculate potential earnings with realistic variables.',
    'landing.feature.p2_title': 'Blueprints & Guides',
    'landing.feature.p2_desc': 'Step-by-step requirements and conversion tips for blogs, mobile apps, music channels, etc.',
    'landing.feature.p3_title': 'GenAI Advisor',
    'landing.feature.p3_desc': 'A customized, context-aware chatbot backing your active income strategy with Gemini insights.',
    'landing.pricing.title': 'Pick a path that suits your rate',
    'landing.pricing.subtitle': 'Risk-free mock licensing. Expand limits instantly with sandbox Stripe dispatch.',
    'landing.pricing.free.name': 'Free Sandbox',
    'landing.pricing.free.price': '0',
    'landing.pricing.free.desc': 'Great for evaluating basic digital pathways.',
    'landing.pricing.free.opt1': 'Access to basic channel calculators',
    'landing.pricing.free.opt2': '3 daily AI queries sandbox',
    'landing.pricing.free.opt3': 'Save up to 3 models locally',
    'landing.pricing.pro.name': 'Pro Earning',
    'landing.pricing.pro.price': '29',
    'landing.pricing.pro.desc': 'Designed for serious creators expanding channels.',
    'landing.pricing.pro.opt1': 'Unlimited AI consultations',
    'landing.pricing.pro.opt2': 'Unlock all premium blueprints & tips',
    'landing.pricing.pro.opt3': 'AdSense layout sandbox display',
    'landing.pricing.pro.opt4': 'Unlimited worksheet savings',
    'landing.pricing.premium.name': 'Premium Master',
    'landing.pricing.premium.price': '79',
    'landing.pricing.premium.desc': 'Enterprise suite for scaling agencies.',
    'landing.pricing.premium.opt1': 'Priority model calculations',
    'landing.pricing.premium.opt2': 'Dedicated monetization strategic audits',
    'landing.pricing.premium.opt3': 'All Pro tier benefits included',
    'landing.pricing.btn_current': 'Active Plan',
    'landing.pricing.btn_upgrade': 'Activate Sandbox',

    // Dashboard
    'dash.title': 'Active Income Dashboard',
    'dash.subtitle': 'Passive income pathways modeled and verified',
    'dash.metric.target': 'Current Target Monthly Goal',
    'dash.metric.est': 'Estimated Monthly Revenue',
    'dash.metric.coverage': 'Income Goal Coverage',
    'dash.metric.saved': 'Worksheet Plans Modeled',
    'dash.action.update': 'Update Monthly Target',
    'dash.blueprints.title': 'Your Active Monetization Blueprints',
    'dash.blueprints.empty1': 'No worksheet blueprints modeled yet.',
    'dash.blueprints.empty2': 'Navigate to Channel Guides to formulate pathways.',
    'dash.blueprints.delete': 'Delete Pathway',
    'dash.blueprints.params': 'Parameters Modeled',
    'dash.blueprints.date': 'Created',
    'dash.helper.title': 'Next Milestone Blueprint Suggestions',
    'dash.helper.suggestion': 'Based on your target goal of ${target}, we suggest establishing a YouTube channel with Mid-roll Mastery or high-ticket freelance retainers to secure direct recurring income.',
    'dash.adsense.widget': 'Sample Ads Banner Active (Simulated)',
    'dash.adsense.desc': 'Displaying monetization context on active creator interfaces.',

    // GuidesList
    'guides.title': 'Channel Monetization Blueprint Blueprints',
    'guides.subtitle': 'Explore channels, simulate configurations, and save customized parameters to worksheets.',
    'guides.sim.title': 'Interactive Channel Simulator',
    'guides.sim.primary': 'Primary Monetization Metric',
    'guides.sim.secondary': 'Secondary Metrics',
    'guides.sim.rpm': 'Base RPM (Revenue per 1,000)',
    'guides.sim.yield': 'Estimated Monthly Yield',
    'guides.sim.strategies': 'Blueprint Strategies',
    'guides.sim.difficulty': 'Difficulty',
    'guides.sim.tf': 'Time to First Dollar',
    'guides.sim.req': 'Requirements',
    'guides.sim.tips': 'Pro tips & Safeguards',
    'guides.sim.save': 'Save Configuration Worksheet',
    'guides.sim.saved': 'Saved Worksheet Successfully!',
    'guides.sim.unlock': 'Unlock Pro Blueprints',

    // AdvisorChat
    'chat.saved.title': 'Saved Consultations',
    'chat.saved.empty1': 'No transcripts saved yet.',
    'chat.saved.empty2': 'Converse with the advisor & save transcripts instantly.',
    'chat.action.clear': 'Clear Active Thread',
    'chat.hub.title': 'Nexora Monetize AI Advisor',
    'chat.hub.status': 'Gemini Active',
    'chat.hub.tagline': 'Actionable advice scaled with platform RPMs',
    'chat.hub.save': 'Save Thread',
    'chat.hub.saved': 'Saved!',
    'chat.gate.title': 'AI Monetization Consultant Gated',
    'chat.gate.desc': 'To keep platform performance pristine, our top-tier Gemini consultation engine is limited to Pro members.',
    'chat.gate.prompt': 'You have completed 3/3 daily sandbox chats. Complete your purchase simulation to converse unlimitedly.',
    'chat.welcome.title': "Let's refine your digital revenue engines",
    'chat.welcome.desc': 'Provide details about your content niche, time constraints, or target audience parameters. Nexora AI will formulate monetization workflows.',
    'chat.suggestion.p1_label': 'YouTube Strategy',
    'chat.suggestion.p1_text': 'I run a music review channel. How do I optimize affiliate links in video descriptions to increase commissions?',
    'chat.suggestion.p2_label': 'Mobile App Strategy',
    'chat.suggestion.p2_text': 'I have a weather app with 5,000 active downloads. What is the best balance between banner ads and in-app upgrades?',
    'chat.suggestion.p3_label': 'Blogging Strategy',
    'chat.suggestion.p3_text': 'How can I increase my SEO blog page RPM from $8 to $25 in the developer space?',
    'chat.placeholder': 'Ask the Monetization Advisor anything...',
    'chat.placeholder_limit': 'Unlocked consult limits exceeded...',
    'chat.sending': 'Nexora AI is calculating CPM channels and strategy vectors...',

    // AdminPanel
    'admin.title': 'Administrative Master Dashboard',
    'admin.subtitle': 'Verify platform ledger inputs, simulated stripe dispatch, and toggle Global parameters',
    'admin.mrr': 'Estimated MRR',
    'admin.mrr_trend': '+15% week-over-week trends',
    'admin.paying': 'Paying subscribers',
    'admin.paying_note': 'Free and paid tiers active',
    'admin.adsense': 'Real AdSense Integration',
    'admin.ads_on': 'Turn Off Ads',
    'admin.ads_off': 'Turn On Ads',
    'admin.helper': 'Display layouts across feeds',
    'admin.server': 'Server Status',
    'admin.server_status': 'READY',
    'admin.server_note': 'Express API proxies safe',
    'admin.ledger.title': 'Ledger: Sandbox Stripe Payments',
    'admin.ledger.count': 'Transactions',
    'admin.ledger.col_id': 'TXN ID',
    'admin.ledger.col_email': 'CUSTOMER EMAIL',
    'admin.ledger.col_tier': 'LICENSE TIER',
    'admin.ledger.col_amt': 'AMOUNT PAID',
    'admin.ledger.col_status': 'STATUS',
    'admin.ledger.col_time': 'TIMESTAMP',
    'admin.adsense_helper.title': 'Google AdSense ready',
    'admin.adsense_helper.desc': 'Copy or customize the dynamic production script below configured alongside your publisher credentials.',
    'admin.adsense_helper.copied': 'Copied!',
    'admin.broadcast.title': 'System Announcements',
    'admin.broadcast.active': 'Active Advisory:',
    'admin.broadcast.placeholder': 'Type high priority updates for user dashboards...',
    'admin.broadcast.btn': 'Publish Announcement',

    // AuthModal
    'auth.welcome_back': 'Welcome Back',
    'auth.create': 'Create Your Account',
    'auth.welcome_back_desc': 'Sign in to access your advisor workspace and saved goals.',
    'auth.create_desc': 'Enter your targets to customize your automated reports.',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.label_name': 'Display Name',
    'auth.placeholder_name': 'Enter your name',
    'auth.label_email': 'Email Address',
    'auth.placeholder_email': 'name@domain.com',
    'auth.label_password': 'Password',
    'auth.label_goal': 'Income Goal ($/mo)',
    'auth.label_plan': 'Free Sandbox plan',
    'auth.option_free': 'Free Starter Plan',
    'auth.option_pro': 'Pro Plan ($29/mo)',
    'auth.option_premium': 'Premium Plan ($79/mo)',
    'auth.btn_login': 'Log In Securely',
    'auth.btn_signup': 'Complete Registration',
    'auth.quick_title': 'Developer Quick-Test Accounts',
    'auth.fill_fields': 'Please fill out all required fields.',
    'auth.name_req': 'A display name is required for registration.',
    'auth.success_msg': 'Signed in successfully!',

    // StripeCheckout
    'stripe.cancel': 'Cancel payment',
    'stripe.dispatch': 'SECURE INTEGRATION DISPATCH',
    'stripe.title': 'Payment Checkout',
    'stripe.license': 'Nexora Lifetime Pass / Mo',
    'stripe.subtotal': 'Subtotal',
    'stripe.tax': 'Taxes & Surcharges',
    'stripe.gateway': 'Stripe Gateway Processing',
    'stripe.free': 'FREE',
    'stripe.due': 'Total Due Now',
    'stripe.note': 'Direct production sandbox active. Payment will adjust your mock profile immediately.',
    'stripe.card': 'Card Details',
    'stripe.card_note': 'Use safe mock credit digits below 100% risk free',
    'stripe.placeholder_name': 'Enter full name',
    'stripe.visa': 'VISA',
    'stripe.placeholder_expiry': 'MM/YY',
    'stripe.placeholder_cvc': '3-digit',
    'stripe.tls': 'Encrypted with TLS 1.3. Hosted under merchant tokenization safeguards.',
    'stripe.btn_pay': 'Pay $${price}.00 via Stripe API',
    'stripe.processing_title': 'Engaging Stripe Gateways',
    'stripe.processing_note': 'Transmitting transaction tokens securely. Verifying mock balances and preparing license setup...',
    'stripe.confirm_title': 'Subscription Confirmed!',
    'stripe.confirm_txn': 'Transaction Code',
    'stripe.confirm_note': 'Thank you! Your active workspace session is being reloaded with premium benefits unlocked...',

    // Footer
    'footer.copyright': '© 2026 nexoramonetize.com. All rights reserved. Built cleanly with React & Google GenAI API.'
  },
  fr: {
    // Nav & Brand
    'nav.brand.name': 'Nexora Monetize',
    'nav.brand.tag': 'Suite de Revenus Passifs',
    'nav.tab.dashboard': 'Tableau de bord',
    'nav.tab.guides': 'Guides des canaux',
    'nav.tab.chat': 'Conseiller IA',
    'nav.tab.admin': 'Administration',
    'nav.action.login': 'Connexion',
    'nav.action.start': 'Débuter',
    'nav.action.signed_in_as': 'Connecté en tant que',
    'nav.action.disconnect': 'Se déconnecter',
    'nav.action.logout': 'Déconnecter la session',

    // Landing Page
    'landing.hero.badge': "Moteur de revenus propulsé par l'IA",
    'landing.hero.title1': 'Trouvez des opportunités.',
    'landing.hero.title2': 'Créez des revenus.',
    'landing.hero.title3': 'Progressez plus vite.',
    'landing.hero.subtitle': "La suite tout-en-un pour accélérer les gains numériques. Activez un conseiller IA en monétisation alimenté par Gemini, des feuilles de calcul interactives, des plans d'action par canal et des préréglages prêts à intégrer.",
    'landing.hero.dashboard_btn': 'Aller au Tableau de Bord',
    'landing.hero.start_btn': 'Modéliser Gratuitement',
    'landing.hero.signin_btn': 'Se Connecter / S\'Inscrire',
    'landing.calc.badge': 'Simulation Interactive de Revenus',
    'landing.calc.title': 'Estimez vos Canaux',
    'landing.calc.subtitle': 'Sélectionnez un canal de monétisation pour évaluer instantanément son potentiel.',
    'landing.calc.traffic': 'Volume de Trafic Mensuel',
    'landing.calc.estimate': 'Estimation de Revenu Mensuel',
    'landing.calc.rpm_note': 'Calculé selon les RPM (Revenu Par Mille) moyens du secteur.',
    'landing.calc.save': 'Enregistrer la Simulation',
    'landing.calc.pro_note': 'Créez un compte gratuit pour personnaliser les paramètres et débloquer des analyses IA approfondies.',
    'landing.feature.title': 'Des fonctionnalités conçues pour votre succès',
    'landing.feature.p1_title': 'Worksheets & Modèles',
    'landing.feature.p1_desc': 'Ajustez vos métriques, simulez vos volumes et calculez vos gains potentiels avec des variables réalistes.',
    'landing.feature.p2_title': "Guides d'Action & Blueprints",
    'landing.feature.p2_desc': "Conditions d'éligibilité étape par étape et astuces de conversion pour blogs, apps mobiles, musique, etc.",
    'landing.feature.p3_title': 'Conseiller IA Gemini',
    'landing.feature.p3_desc': 'Un assistant interactif intelligent qui étudie vos modèles et enrichit votre stratégie de monétisation.',
    'landing.pricing.title': 'Choisissez un plan adapté à votre rythme',
    'landing.pricing.subtitle': 'Simulation sans risque financier. Débloquez les plafonds de requêtes instantanément via Stripe Sandbox.',
    'landing.pricing.free.name': 'Gratuit Sandbox',
    'landing.pricing.free.price': '0',
    'landing.pricing.free.desc': 'Parfait pour modéliser une première idée.',
    'landing.pricing.free.opt1': 'Accès aux estimateurs de base',
    'landing.pricing.free.opt2': '3 requêtes IA offertes par jour',
    'landing.pricing.free.opt3': 'Jusqu\'à 3 modèles enregistrés',
    'landing.pricing.pro.name': 'Créateur Earning',
    'landing.pricing.pro.price': '29',
    'landing.pricing.pro.desc': 'Idéal pour les créateurs qui étendent leurs canaux.',
    'landing.pricing.pro.opt1': 'Consultations IA illimitées',
    'landing.pricing.pro.opt2': 'Débloquez toutes les astuces premium',
    'landing.pricing.pro.opt3': 'Bannières AdSense simulées actives',
    'landing.pricing.pro.opt4': 'Sauvegardes de simulations illimitées',
    'landing.pricing.premium.name': 'Maître Indépendant',
    'landing.pricing.premium.price': '79',
    'landing.pricing.premium.desc': 'La suite ultime pour gérer plusieurs agences.',
    'landing.pricing.premium.opt1': 'Calculs et priorités de modèles',
    'landing.pricing.premium.opt2': 'Audits stratégiques de monétisation dédiés',
    'landing.pricing.premium.opt3': 'Tous les avantages du plan Créateur',
    'landing.pricing.btn_current': 'Plan Actif',
    'landing.pricing.btn_upgrade': 'Activer Sandbox',

    // Dashboard
    'dash.title': 'Tableau de Bord des Revenus Actifs',
    'dash.subtitle': 'Parcours de revenus passifs modélisés et vérifiés',
    'dash.metric.target': 'Objectif Mensuel Cible Actuel',
    'dash.metric.est': 'Revenu Mensuel Estimé',
    'dash.metric.coverage': 'Couverture de l\'Objectif cible',
    'dash.metric.saved': 'Simulations Modélisées',
    'dash.action.update': 'Mettre à jour la cible',
    'dash.blueprints.title': 'Vos Plans de Monétisation Actifs',
    'dash.blueprints.empty1': 'Aucune feuille de calcul enregistrée.',
    'dash.blueprints.empty2': 'Rendez-vous dans les Guides des canaux pour modéliser vos parcours.',
    'dash.blueprints.delete': 'Supprimer le Parcours',
    'dash.blueprints.params': 'Paramètres Modélisés',
    'dash.blueprints.date': 'Enregistré',
    'dash.helper.title': 'Inspirations pour votre prochain palier',
    'dash.helper.suggestion': 'Sur la base de votre objectif de ${target}, nous vous suggérons de lancer une chaîne YouTube avec la stratégie Mid-roll ou d\'adopter des forfaits d\'avis conseil récurrents pour sceller des revenus directs réguliers.',
    'dash.adsense.widget': 'Bannière publicitaire active (Simulée AdSense)',
    'dash.adsense.desc': 'Affichage de bannières sur l\'interface créateur.',

    // GuidesList
    'guides.title': 'Plans de Monétisation des Canaux',
    'guides.subtitle': 'Explorez les canaux, simulez des configurations et enregistrez vos paramètres personnalisés.',
    'guides.sim.title': 'Simulateur de Canal Interactif',
    'guides.sim.primary': 'Métrique Principale de Monétisation',
    'guides.sim.secondary': 'Métriques Secondaires',
    'guides.sim.rpm': 'RPM de Base (Revenu pour 1 000)',
    'guides.sim.yield': 'Rendement Mensuel Estimé',
    'guides.sim.strategies': 'Stratégies du Plan d\'Action',
    'guides.sim.difficulty': 'Difficulté',
    'guides.sim.tf': 'Délai d\'encaissement estimé',
    'guides.sim.req': 'Conditions requises',
    'guides.sim.tips': 'Conseils de Pro & Protections',
    'guides.sim.save': 'Enregistrer la Feuille de Calcul',
    'guides.sim.saved': 'Feuille enregistrée avec succès !',
    'guides.sim.unlock': 'Débloquer les Plans Pro',

    // AdvisorChat
    'chat.saved.title': 'Consultations Sauvegardées',
    'chat.saved.empty1': 'Aucun historique sauvegardé.',
    'chat.saved.empty2': 'Échangez avec le conseiller IA et sauvegardez vos discussions ici.',
    'chat.action.clear': 'Effacer la Discussion Active',
    'chat.hub.title': 'Nexora Advisor IA',
    'chat.hub.status': 'Gemini Actif',
    'chat.hub.tagline': 'Conseils stratégiques ajustés aux indicateurs du marché',
    'chat.hub.save': 'Enregistrer la discussion',
    'chat.hub.saved': 'Enregistré !',
    'chat.gate.title': 'Conseiller en Monétisation Gated',
    'chat.gate.desc': 'Pour préserver les performances de la plateforme, notre intelligence d\'avis conseil Gemini est réservée aux membres Pro.',
    'chat.gate.prompt': 'Vous avez atteint la limite de 3/3 chats du bac à sable quotidien. Passez à la simulation Pro pour continuer sans limite.',
    'chat.welcome.title': 'Optimisons vos moteurs de revenus numériques',
    'chat.welcome.desc': 'Présentez votre thématique de contenu, vos contraintes ou votre public cible afin que Nexora IA vous propose un plan de monétisation structuré.',
    'chat.suggestion.p1_label': 'Stratégie YouTube',
    'chat.suggestion.p1_text': 'Je gère une chaîne de critiques musicales. Comment optimiser l\'affiliation sous mes vidéos pour augmenter les ventes ?',
    'chat.suggestion.p2_label': 'Stratégie App Mobile',
    'chat.suggestion.p2_text': 'J\'ai une application météo comptabilisant 5 000 téléchargements actifs. Comment équilibrer bannières et achats intégrés ?',
    'chat.suggestion.p3_label': 'Stratégie Blogging',
    'chat.suggestion.p3_text': 'Comment faire passer le RPM de mon blog technique SEO de 8$ à 25$ auprès d\'un public de développeurs ?',
    'chat.placeholder': 'Demandez n\'importe quoi à l\'expert IA...',
    'chat.placeholder_limit': 'Limite de consultations gratuites atteinte...',
    'chat.sending': 'Nexora IA calcule les canaux CPM et modélise la stratégie...',

    // AdminPanel
    'admin.title': 'Régie Administrative Master',
    'admin.subtitle': 'Supervisez les indicateurs du registre, la simulation Stripe et configurez les filtres généraux',
    'admin.mrr': 'Revenu Mensuel Récurrent (MRR)',
    'admin.mrr_trend': '+15% de gain en glissement hebdomadaire',
    'admin.paying': 'Abonnés payants',
    'admin.paying_note': 'Plafonds gratuits et premium actifs',
    'admin.adsense': 'Intégration Google AdSense Réelle',
    'admin.ads_on': 'Désactiver les Annonces',
    'admin.ads_off': 'Activer les Annonces',
    'admin.helper': 'Diffusion d\'encarts publicitaires',
    'admin.server': 'Statut Serveur',
    'admin.server_status': 'OPÉRATIONNEL',
    'admin.server_note': 'Relais d\'API Express sécurisés',
    'admin.ledger.title': 'Registre Sandbox : Transactions Stripe',
    'admin.ledger.count': 'Paiements enregistrés',
    'admin.ledger.col_id': 'ID DE TXN',
    'admin.ledger.col_email': 'EMAIL DE L\'INDÉPENDANT',
    'admin.ledger.col_tier': 'FORMULE',
    'admin.ledger.col_amt': 'MONTANT PORTÉ',
    'admin.ledger.col_status': 'STATUT',
    'admin.ledger.col_time': 'DATE DE PAIEMENT',
    'admin.adsense_helper.title': 'Prêt pour Google AdSense',
    'admin.adsense_helper.desc': 'Copiez ou configurez l\'intégration dynamique de production ci-dessous synchronisée avec vos identifiants réels Google AdSense.',
    'admin.adsense_helper.copied': 'Copié !',
    'admin.broadcast.title': 'Diffusion d\'Actualités Système',
    'admin.broadcast.active': 'Annonce d\'actualité active :',
    'admin.broadcast.placeholder': 'Tapez les alertes prioritaires pour l\'ensemble des tableaux créateurs...',
    'admin.broadcast.btn': 'Publier la communication',

    // AuthModal
    'auth.welcome_back': 'Bon Retour',
    'auth.create': 'Créez votre Compte',
    'auth.welcome_back_desc': 'Connectez-vous pour retrouver vos analyses de canaux et objectifs.',
    'auth.create_desc': 'Définissez vos objectifs d\'indépendant pour adapter vos prévisions.',
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.label_name': 'Nom à afficher',
    'auth.placeholder_name': 'Saisissez votre nom',
    'auth.label_email': 'Adresse courriel',
    'auth.placeholder_email': 'nom@domaine.com',
    'auth.label_password': 'Mot de passe',
    'auth.label_goal': 'Revenu Ciblé ($/mois)',
    'auth.label_plan': 'Formule du Bac à sable',
    'auth.option_free': 'Essai gratuit Starter',
    'auth.option_pro': 'Licence Pro (29 $/mois)',
    'auth.option_premium': 'Master Premium (79 $/mois)',
    'auth.btn_login': 'Se Connecter Sécurisé',
    'auth.btn_signup': 'Terminer l\'Inscription',
    'auth.quick_title': 'Comptes de test rapide Développeur',
    'auth.fill_fields': 'Veuillez remplir tous les champs requis.',
    'auth.name_req': 'Un nom d\'affichage est requis pour l\'inscription.',
    'auth.success_msg': 'Connexion établie avec succès !',

    // StripeCheckout
    'stripe.cancel': 'Annuler le paiement',
    'stripe.dispatch': 'PORTAIL STRIPE SECURE DISPATCH',
    'stripe.title': 'Paiement d\'Abonnement',
    'stripe.license': 'Licence Mensuelle d\'Accès Nexora',
    'stripe.subtotal': 'Montant HT',
    'stripe.tax': 'Frais & Surcharges',
    'stripe.gateway': 'Frais de transfert Stripe',
    'stripe.free': 'OFFERTS',
    'stripe.due': 'Total à Régler',
    'stripe.note': 'Bac à sable relié en direct. Les privilèges de votre compte virtuel seront immédiatement accrus.',
    'stripe.card': 'Coordonnées Bancaires',
    'stripe.card_note': 'Saisissez des numéros fictifs pour simuler en toute sécurité',
    'stripe.placeholder_name': 'Nom complet du titulaire',
    'stripe.visa': 'VISA',
    'stripe.placeholder_expiry': 'MM/AA',
    'stripe.placeholder_cvc': 'CVC',
    'stripe.tls': 'Cryté en TLS 1.3. Certifié sous la directive de conformité de traitement bancaire.',
    'stripe.btn_pay': 'Payer ${price} $ via l\'API Stripe',
    'stripe.processing_title': 'Interrogation des serveurs de Stripe',
    'stripe.processing_note': 'Transmission des jetons sécurisés de paiement. Validation des soldes fictifs et enregistrement de votre licence...',
    'stripe.confirm_title': 'Abonnement Confirmé !',
    'stripe.confirm_txn': 'Numéro de Transaction',
    'stripe.confirm_note': 'Merci ! Votre session est en cours de rechargement avec les attributs Pro activés...',

    // Footer
    'footer.copyright': '© 2026 nexoramonetize.com. Tous droits réservés. Développé proprement avec React & l\'API Google GenAI.'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nexora_language');
    if (saved === 'fr' || saved === 'en') return saved;
    // Autodetect browser language
    try {
      const browserLanguage = navigator.language || '';
      if (browserLanguage.startsWith('fr')) return 'fr';
    } catch (e) {}
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexora_language', lang);
  };

  const t = (key: string): string => {
    // Return translation if exists
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to English
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    return key;
  };

  // Helper to dynamically translate a channel description, tips, etc. on the fly!
  const translateChannel = (channel: MonetizationChannel): MonetizationChannel => {
    if (language === 'en') return channel;

    // Translation mapping for channel metadata
    const frData: Record<string, Partial<MonetizationChannel>> = {
      youtube: {
        name: 'Programme Partenaire YouTube',
        tagline: 'Gagnez grâce à AdSense, à l’affiliation et aux partenariats de marque.',
        metricLabel: 'Vues Mensuelles',
        requirements: [
          '1 000 abonnés avec 4 000 heures de visionnage publiques valides au cours des 12 derniers mois, OU',
          '1 000 abonnés avec 10 millions de vues de Shorts publiques valides au cours des 90 derniers jours.',
          'Respect des politiques de monétisation des chaînes YouTube.',
          'Compte Google AdSense actif associé à votre chaîne.'
        ],
        tips: [
          'Optimisez les miniatures : une miniature à fort taux de clic (CTR) peut augmenter les impressions de 200 %.',
          '30 premières secondes : maximisez la rétention de l’audience en accrochant immédiatement le spectateur.',
          'Appel à l’action de fin d’écran : incitez à regarder des playlists associées pour doubler la durée de la session.',
          'Ajustement thématique : les thèmes de la finance, de la tech et de l’immobilier génèrent un RPM 3x plus élevé que l’humour.'
        ],
        strategies: [
          { title: 'Maîtrise des annonces Mid-roll', description: 'Placez stratégiquement des pauses naturelles dans les vidéos de 8 minutes ou plus pour diffuser des publicités mid-roll rémunératrices.', difficulty: 'Easy', timeToFirstDollar: '1 - 3 mois' },
          { title: 'Catalogue d’Affiliation Hybride', description: 'Créez une section de ressources permanentes sous les descriptions de vos vidéos avec des liens d’affiliation Amazon ou SaaS.', difficulty: 'Medium', timeToFirstDollar: 'Immédiat' },
          { title: 'Partenariats de Marque Directs', description: 'Concevez des kits médias présentant vos statistiques d’audience et contactez des sponsors cibles au lieu de dépendre d’AdSense.', difficulty: 'Hard', timeToFirstDollar: '2 - 4 mois' }
        ]
      },
      tiktok: {
        name: 'Récompenses pour Créateurs TikTok',
        tagline: 'Monétisez des vidéos courtes à fort engagement et récoltez des cadeaux LIVE.',
        metricLabel: 'Vues Mensuelles',
        requirements: [
          'Avoir au moins 10 000 abonnés authentiques.',
          'Cumuler au moins 100 000 vues de vidéos au cours des 30 derniers jours.',
          'Avoir au moins 18 ans et créer du contenu original et qualitatif de plus de 1 minute.',
          'Profil fiscalement vérifié dans les juridictions éligibles.'
        ],
        tips: [
          'Créez des vidéos de plus de 60s : les algorithmes favorisent activement les formats longs et détaillés.',
          'Montage dynamique : évitez la perte d’attention en insérant de nouvelles transitions ou effets toutes les 3 secondes.',
          'TikTok Shop direct : proposez des produits d’affiliation pertinents directement dans la vidéo.',
          'Séries et Playlists : organisez vos tutoriels sous forme de sagas en plusieurs parties.'
        ],
        strategies: [
          { title: 'Intégration Shop Affiliation', description: 'Sélectionnez des articles fortement commissionnés dans le Centre des vendeurs et faites des présentations vidéo démontrant leurs avantages.', difficulty: 'Easy', timeToFirstDollar: '1 - 2 semaines' },
          { title: 'Animation de Lives Interactifs', description: 'Proposez des séances de questions-réponses ou des sessions interactives 3 fois par semaine pour stimuler l’envoi de cadeaux créateurs.', difficulty: 'Medium', timeToFirstDollar: 'Immédiat' },
          { title: 'Sponsorisation de Sons Originaux', description: 'Associez-vous à des labels indépendants ou des artistes pour utiliser leurs morceaux promotionnels dans vos défis viraux.', difficulty: 'Hard', timeToFirstDollar: '1 - 2 mois' }
        ]
      },
      google_play: {
        name: 'Google Play & App Store',
        tagline: 'Déployez vos logiciels à l’échelle mondiale grâce au freemium et aux achats intégrés.',
        metricLabel: 'Téléchargements Actifs',
        requirements: [
          'Compte Google Play Console (frais d’inscription uniques de 25 $).',
          'Conformité avec les API cibles d’Android et les exigences de sécurité.',
          'Évaluation IARC complétée sur la console développeur.',
          'Profil de paiement marchand configuré pour les transferts bancaires.'
        ],
        tips: [
          'Optimisation pour les magasins (ASO) : attirez du trafic organique quotidien grâce aux mots-clés de haut rang et à de superbes captures d’écran.',
          'Passerelles d’achat fluides : proposez une mise à niveau aux moments de réussite utilisateur au lieu de bloquer l’usage de base.',
          'Admob & Publicités secondaires : complétez vos gains de vente en intégrant des bannières publicitaires et des formats vidéo récompensés.',
          'Notifications ciblées : engagez régulièrement vos utilisateurs avec des alertes d’action intelligentes.'
        ],
        strategies: [
          { title: 'Monétisation Hybride AdMob', description: 'Incorporez des bannières de bas de page et offrez à vos utilisateurs un accès sans publicité s’ils regardent une annonce vidéo de 30 secondes.', difficulty: 'Easy', timeToFirstDollar: '1 mois' },
          { title: 'Formule Premium Équilibrée', description: 'Conservez l’utilitaire de base gratuit, mais limitez les options d’export, traitement par lot ou sauvegarde locale.', difficulty: 'Medium', timeToFirstDollar: 'Immédiat au lancement' },
          { title: 'Licences Corporate en Marque Blanche', description: 'Créez une architecture logicielle modulaire vous permettant de la revendre à de grands clients locaux sous leur propre marque.', difficulty: 'Hard', timeToFirstDollar: '3 - 6 mois' }
        ]
      },
      music: {
        name: 'Monétisation de Droits Musicaux',
        tagline: 'Gagnez de l’argent grâce au streaming, à l’habillage sonore de contenus et aux banques de sons.',
        metricLabel: 'Écoutes Mensuelles',
        requirements: [
          'Distributeur indépendant agréé (ex : DistroKid, TuneCore, LANDR).',
          'Composition 100% originale ou droits d’échantillonnage de tiers entièrement libérés.',
          'Inscription auprès des organismes de gestion des droits (BMI, ASCAP, PRS) pour collecter les redevances.'
        ],
        tips: [
          'Soumission de listes éditoriales Spotify : proposez votre titre directement sur Spotify for Artists 4 semaines avant sa sortie.',
          'Créez du Lo-Fi ou des sons d’ambiance : les pièces instrumentales favorisent une écoute en tâche de fond, multipliant les écoutes.',
          'Sorties fréquentes : privilégiez la sortie d’un single toutes les 3 à 4 semaines plutôt qu’un album entier par an.',
          'Vente de banques de pistes : vendez des fichiers d’instruments séparés à d’autres producteurs pour maximiser vos revenus.'
        ],
        strategies: [
          { title: 'Relations Curateurs Playlists', description: 'Utilisez des outils d’analyse pour trouver les contacts des propriétaires de listes majeures de votre créneau afin de leur proposer votre titre.', difficulty: 'Easy', timeToFirstDollar: '2 - 4 semaines' },
          { title: 'Placement Habillage Audio (Sync)', description: 'Proposez vos titres sur des plateformes comme Artlist, Epidemic Sound ou Pond5 pour habiller les vidéos de créateurs.', difficulty: 'Medium', timeToFirstDollar: '1 - 3 mois' },
          { title: 'Ventes Digitales Exclusives', description: 'Orientez vos auditeurs vers Bandcamp pour vendre directement du matériel exclusif, de l’audio haute fidélité ou vinyles de collection.', difficulty: 'Hard', timeToFirstDollar: 'Immédiat' }
        ]
      },
      film: {
        name: 'Cinéma Indépendant & VOD',
        tagline: 'Vendez vos documentaires, tutoriels vidéo complets ou packs d’habillage graphique.',
        metricLabel: 'Ventes et Locations Mensuelles',
        requirements: [
          'Fichiers masters originaux HD/4K de qualité professionnelle (Formats ProRes ou H264 de haute qualité).',
          'Contrats signés pour l’ensemble des acteurs, morceaux sonores et lieux de tournage physiques.',
          'Compte distributeur actif auprès d’agrégateurs réputés (Filmhub, Vimeo On Demand, Gumroad).'
        ],
        tips: [
          'Ciblez une audience de passionnés : les passions spécialisées, l’histoire locale ou tutoriels exclusifs sont 10x plus faciles à vendre.',
          'Réalisez une bande-annonce exceptionnelle : une vidéo promotionnelle captivante de 60 secondes détermine à 85 % l’envie d’achat.',
          'Créez une liste de diffusion en amont : proposez des bandes-annonces gratuites pour recueillir des contacts de personnes intéressées.',
          'Optimisation pour le référencement (SEO) : nommez vos vidéos en fonction des recherches directes de votre cible (ex : Masterclass Lumière Pratique).'
        ],
        strategies: [
          { title: 'Campagnes de Prévente Participative', description: 'Proposez des aperçus exclusifs des coulisses ou du scénario sur Kickstarter ou Indiegogo pour financer la post-production.', difficulty: 'Medium', timeToFirstDollar: '2 - 5 months' },
          { title: 'Diffusion Multi-plateforme (Agrégateurs)', description: 'Associez-vous à des réseaux partenaires comme Filmhub pour distribuer vos œuvres sur Amazon Prime, Tubi et Apple TV.', difficulty: 'Hard', timeToFirstDollar: '3 - 6 months' }
        ]
      },
      blogging: {
        name: 'Blogging de Niche & Affiliation SEO',
        tagline: 'Générez du trafic de recherche ciblé vers des guides d’achat, tests produits et articles de conseils.',
        metricLabel: 'Pages Vues Mensuelles',
        requirements: [
          'Hébergement autonome (ex : WordPress, Ghost, sites statiques Astro).',
          'Rédaction de contenus qualitatifs, pertinents et optimisés pour les recherches Google.',
          'Validation d’entrée des régies publicitaires (ex : Google AdSense immédiat, Raptive exige 100 000 pages vues).'
        ],
        tips: [
          'Silos et grappes de contenu : créez des articles piliers reliés à des sous-pages expertes pour maximiser votre autorité Google.',
          'Structure de lecture rapide : utilisez des listes à puces, tableaux et du gras pour maintenir l’internaute mobile engagé.',
          'Vitesse de chargement : la rapidité du site influence directement son classement. Allégez les images et évitez les plugins inutiles.',
          'Mots-clés à haute intention : ciblez des expressions d’achat claires comme « meilleur logiciel CRM à moins de 50$ ».'
        ],
        strategies: [
          { title: 'Comparatifs Produits Affiliés', description: 'Rédigez des évaluations approfondies et impartiales de plusieurs solutions du marché en insérant des liens d’affiliation directs.', difficulty: 'Easy', timeToFirstDollar: '2 - 4 semaines' },
          { title: 'Régies Publicitaires Premium', description: 'Accélérez le volume de pages vues pour être approuvé chez des partenaires haut de gamme comme Mediavine, augmentant le RPM par 5.', difficulty: 'Medium', timeToFirstDollar: '3 - 6 mois' }
        ]
      },
      freelancing: {
        name: 'Prestations Freelance Haut de Gamme',
        tagline: 'Proposez vos compétences numériques spécialisées à des clients d’envergure internationale.',
        metricLabel: 'Heures Facturables par Mois',
        requirements: [
          'Portfolio numérique solide mettant en valeur les résultats et solutions apportés aux clients passés.',
          'Comptes opérationnels sur des réseaux professionnels (Upwork, Fiverr, LinkedIn, Polywork).',
          'Modèle de proposition professionnelle soigné et contrats de prestation standards.'
        ],
        tips: [
          'Arrêtez la facturation horaire : passez à une tarification basée sur la valeur pour que vos gains augmentent avec les résultats de vos clients.',
          'Devenez ultra-spécialisé : soyez « l’expert de l’optimisation de l’affichage de paniers Shopify » plutôt qu’un « développeur web ».',
          'Persévérance relationnelle : 80% des contrats se signent après la 3ème tentative de relance. Équipez-vous d’une relance soignée.',
          'Surpassez les attentes : livrez vos jalons de travail en avance de phase pour fidéliser vos clients et décrocher un contrat mensuel récurrent.'
        ],
        strategies: [
          { title: 'Audits de Conversion à Froid', description: 'Créez une vidéo Loom de 2 minutes listant des axes d’amélioration précis sur les pages des entreprises pour proposer votre aide.', difficulty: 'Easy', timeToFirstDollar: '1 - 3 semaines' },
          { title: 'Contrats d’Accompagnement Mensuels', description: 'Proposez à vos clients de projet de passer à une formule de conseil récurrente pour piloter leurs plans de monétisation sur le long terme.', difficulty: 'Medium', timeToFirstDollar: 'Immédiat' }
        ]
      }
    };

    const translated = frData[channel.id];
    if (translated) {
      return {
        ...channel,
        name: translated.name || channel.name,
        tagline: translated.tagline || channel.tagline,
        metricLabel: translated.metricLabel || channel.metricLabel,
        requirements: translated.requirements || channel.requirements,
        tips: translated.tips || channel.tips,
        strategies: channel.strategies.map((strategy, index) => {
          const transStrat = translated.strategies?.[index];
          if (transStrat) {
            return {
              ...strategy,
              title: transStrat.title,
              description: transStrat.description,
              difficulty: transStrat.difficulty || strategy.difficulty,
              timeToFirstDollar: transStrat.timeToFirstDollar || strategy.timeToFirstDollar
            };
          }
          return strategy;
        })
      };
    }

    return channel;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateChannel }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
