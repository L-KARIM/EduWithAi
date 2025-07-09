

# EduWithAi

EduWithAi est une application web moderne qui transforme automatiquement tout texte ou PDF en ressources d’apprentissage personnalisées grâce à l’intelligence artificielle.

Pensée pour les étudiants, les enseignants et les autodidactes, elle résume, explique, extrait les concepts clés, génère des quiz et des flashcards à partir de n’importe quel contenu.
---

## 📽️ Video Demo

Watch the live demo:  
👉  
https://github.com/user-attachments/assets/aee5183f-e917-462c-b573-c997f06808c8

---

## 🖼️ Screenshots

<img width="1942" height="919" alt="Image" src="https://github.com/user-attachments/assets/10fa0b69-504c-4de4-8703-291adbf5174e" /> 
<img width="1936" height="913" alt="Image" src="https://github.com/user-attachments/assets/b15744f9-51b3-4b9c-8921-581f1a79043e" /> 
<img width="2047" height="913" alt="Image" src="https://github.com/user-attachments/assets/e3e1e903-c10b-4866-a5e9-9ffa2fd1ac29" /> 
<img width="2122" height="913" alt="Image" src="https://github.com/user-attachments/assets/033cd75e-99ba-4685-89ad-dc86b28fdab8" />

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

## 🧠 Target Use Case

- Students reviewing long PDFs or lessons  
- Busy professionals studying docs  
- Anyone learning from reading

---

## 🔧 Tech Stack

- **Frontend**: React + Tailwind CSS  
- **Backend**: Node.js + Express  
- **AI Engine**: OpenAI API (or Ollama local model)  
- **Database**: MongoDB or Firebase  
- **Auth**: Firebase Auth  
- **Deployment**: Vercel or Render

---


EduWithAi (Monorepo)
├── frontend/ (React App)
│   ├── pages/
│   ├── components/
│   └── services/
├── backend/ (Express API)
│   ├── routes/
│   ├── controllers/
│   └── services/
├── ai/ (AI utilities)
│   └── summarizer.js
└── database/
    └── models/
---

## ⚙️ Setup

1. Clone this repo  
   ```bash
   git clone https://github.com/L-KARIM/EduWithAi
   cd EduWithAi

---

2. Frontend Setup 

cd client
npm install
npm run dev

---

3.Backend Setup

    ```bash
    cd server
    # For Flask
    pip install -r requirements.txt
    python main.py
    # OR for Node.js
    npm install
    npm run start


4. Add .env files
Create .env file with your OpenAI API key:

    ```.env
    OPENAI_API_KEY=your_api_key_here
---

🤝 Contributing
1.Fork the repo
2.Create a new branch (git checkout -b feature)
3.Commit changes (git commit -m 'add feature')
4.Push (git push origin feature)
5.Create a Pull Request

---

📄 Licence
MIT License

👤 Auteur
Karim Laafif
Étudiant en Data Engineering – ESTA Agadir
<a href="[URL](https://www.linkedin.com/in/l-karim/)">LinkedIn </a>
