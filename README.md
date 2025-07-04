# EduWithAi

EduWithAi est une application web moderne qui transforme automatiquement tout texte ou PDF en ressources d’apprentissage personnalisées grâce à l’intelligence artificielle.

Pensée pour les étudiants, les enseignants et les autodidactes, elle résume, explique, extrait les concepts clés, génère des quiz et des flashcards à partir de n’importe quel contenu.

---

## 🎯 Fonctionnalités

- 🧠 **Résumé intelligent** : Résume des textes complexes en paragraphes ou en points.
- 📚 **Extraction de concepts** : Détaille les notions clés détectées dans le texte.
- 🎓 **Générateur de quiz** : Questions à choix multiples ou Vrai/Faux automatiquement créées.
- 🔁 **Flashcards** : Création automatique de cartes pour révision rapide.
- 👶 **Mode “Expliquer comme si j'avais 5 ans”** : Version simplifiée pour débutants.
- 🌐 **Support multilingue** : Résultats disponibles en français, anglais ou arabe.
- 📄 **Analyse de documents** : Prise en charge des fichiers `.txt` et `.pdf`.
- 🌙 **Mode sombre** : Interface responsive avec thème clair/sombre.

---

## 🛠️ Stack Technique

| Côté           | Technologie               |
|----------------|---------------------------|
| Frontend       | React.js, TailwindCSS     |
| Backend        | Flask ou Node.js          |
| API IA         | OpenAI GPT-3.5 / GPT-4     |
| Parsing PDF    | `pdf-parse` ou `pdf.js`   |
| Hébergement    | Vercel / Render / Railway |

---

## 📁 Structure du Projet

EduWithAi/
├── client/ # Frontend React
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.jsx
│ └── public/
├── server/ # Backend Flask ou Node.js
│ ├── routes/
│ └── main.py ou index.js
├── .env.example
├── README.md
└── package.json

