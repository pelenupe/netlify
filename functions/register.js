const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DBID;

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }
  const { name, email } = data;
  if (!name || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Name and Email required" }) };
  }
  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email },
        // Add more fields per your database columns
      }
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true, id: response.id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Notion API error", reason: err.message }) };
  }
};
