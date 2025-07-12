// api.js - All backend API calls for Flask integration
// For now, these are mock implementations. Replace fetch URLs with Flask endpoints.

const delay = ms => new Promise(res => setTimeout(res, ms));

export const api = {
  async login(username, password) {
    await delay(500);
    // Replace with: fetch('/api/auth/login', ...)
    if (username === 'demo' && password === 'demo') {
      return { success: true, user: { username: 'demo', token: 'demo-token' } };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  async register(username, password) {
    await delay(500);
    // Replace with: fetch('/api/auth/register', ...)
    if (username === 'demo') {
      return { success: false, message: 'Username already exists' };
    }
    return { success: true };
  },

  async getQuestions() {
    await delay(500);
    // Replace with: fetch('/api/questions', ...)
    return [
      {
        id: 1,
        title: 'How to use StackIt?',
        description: '<b>Welcome!</b> Use this demo to try StackIt.',
        tags: ['React'],
        author: 'demo',
        answers: [
          {
            id: 1,
            text: 'Just post your questions and answers here!',
            author: 'demo',
            votes: 2,
            accepted: true,
          },
        ],
        votes: 1,
        acceptedAnswerId: 1,
      },
    ];
  },

  async getQuestion(id) {
    const questions = await this.getQuestions();
    return questions.find(q => q.id === Number(id));
  },

  async postQuestion({ title, description, tags, author }) {
    await delay(500);
    // Replace with: fetch('/api/questions', ...)
    return {
      id: Date.now(),
      title,
      description,
      tags,
      author,
      answers: [],
      votes: 0,
      acceptedAnswerId: null,
    };
  },

  async postAnswer({ questionId, text, author }) {
    await delay(500);
    // Replace with: fetch(`/api/questions/${questionId}/answers`, ...)
    return {
      id: Date.now(),
      text,
      author,
      votes: 0,
      accepted: false,
    };
  },

  async vote({ type, id, delta }) {
    await delay(300);
    // Replace with: fetch(`/api/${type}/${id}/vote`, ...)
    return { success: true };
  },

  async acceptAnswer({ answerId }) {
    await delay(300);
    // Replace with: fetch(`/api/answers/${answerId}/accept`, ...)
    return { success: true };
  },
};
