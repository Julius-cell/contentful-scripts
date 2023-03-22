const contentfulManagement = require("contentful-management");
require("dotenv").config();

const SPACE_ID = process.env.SPACE_ID;
const ENVIRONMENT = "master";

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.CONTENT_MANAGEMENT_ACCESS_TOKEN,
});

const main = async () => {
  const environment = await getEnvironment(SPACE_ID, ENVIRONMENT);

  const { items: entries } = await getEntries(environment);

  entries.forEach(async (entry) => {
    await updateEntry(entry.sys.id, environment);
  });
};

const getEnvironment = async (spaceId, environmentId) => {
  const space = await clientManagement.getSpace(spaceId);
  return await space.getEnvironment(environmentId);
};

const getContentTypes = async () => await client.getContentTypes();

const getContentType = async (contentTypeId) =>
  await client.getContentType(contentTypeId);

const getEntries = async (environment) =>
  await environment.getEntries({
    content_type: "pgPage",
    "fields.title[match]": "about",
  });

const createTag = () => {
  clientManagement.tag.createWithId(
    { tagId: "tag1" },
    { sys: { visibility: "public" }, name: "Tag 1" }
  );

  clientManagement.tag.getMany().then((tags) => console.log(tags));
};

const updateEntry = async (entryId, environment) => {
  try {
    const entry = await environment.getEntry(entryId);
    entry.metadata.tags.push({
      sys: {
        type: "Link",
        linkType: "Tag",
        id: "tag1",
      },
    });

    entry.update();
    console.log(`Entry ${entry.sys.id} updated.`);
    return;
  } catch (error) {
    console.error(error);
  }
};

main();
