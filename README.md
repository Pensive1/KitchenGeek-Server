# Kitchen Geek

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

Recalculating recipe servings can be time-consuming. A recipe may offer a large serving but you want less. And vice versa.

Kitchen Geek helps people discover recipes based on available ingredients, resize servings, and tracks needed ingredients.

## Server Features

This server allows the Kitchen Geek client to store, read, delete and check for bookmarked recipes.

- All data is stored in a JSON file
- The client interacts with the JSON file through an API made with Node and Express.

## Installation

### Server

1. Clone or download this project _(Click the green code dropdown above)_.

```bash
  git clone https://github.com/Pensive1/KitchenGeek.git
```

2. Open your terminal and install NodeJS. _If you have node, please skip this step_.

```bash
  npm install npm@latest -g
```

3. In your terminal or code editor, browse into the folder.

4. Run `npm install` to download the necessary packages

```bash
  npm install
```

> **Note:** This project requires API details in a `.env` file. Send me an [email](mailto:racquaye89@gmail.com?subject=Kitchen%20Geek%20env%20info) for details, fill in the quotes then rename `.env.example` to `.env`.

5. Once complete, type `npm start` to run the server.

> **Note:** The server must run at all times for Kitchen Geek to run effectively.

### Client

Head back to the [client repo](https://github.com/Pensive1/KitchenGeek#installation) to continue installation.
