const contentfulManagement = require("contentful-management");
require("dotenv").config();

const SPACE_ID = process.env.SPACE_ID;
const ENVIRONMENT_SOURCE = process.env.ENVIRONMENT_SOURCE;
const ENVIRONMENT_TARGET = process.env.ENVIRONMENT_TARGET;

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.CONTENT_MANAGEMENT_ACCESS_TOKEN,
});

const main = async () => {
  // Get env staging
  const envSource = await getEnvironment(SPACE_ID, ENVIRONMENT_SOURCE);
  
  // Get entries from content type commune
  // const { items: communesStg } = await envSource.getPublishedEntries({
  //   content_type: 'commune'
  // })
  // console.log(communesStg);

  // Get env app-staging
  const envTarget = await getEnvironment(SPACE_ID, ENVIRONMENT_TARGET);
  
  // DRAFT ENTRIES (ANY)
  const response = await envSource.getEntries({
    content_type: 'commune'
  })

  // PUBLISHED ENTRIES
  // const response = await envTarget.getPublishedEntries({
  //   content_type: 'commune'
  // })

  // RATE / PER SECOND REQUESTS
  const rate = 7; // Peticiones por segundo
  const delay = 1000 / rate; // Retraso entre peticiones en milisegundos

  for (let i = 0; i < response.items.length; i++) {
    await creatingEntry(envTarget, 'commune', response.items[i]);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

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

const creatingEntry = async (environment, content_type, entry) => {
  try {
    console.log(`CreatingEntry entry ${entry.sys.id}`);
    await environment.createEntry(content_type, entry);
  } catch (error) {
    console.error(`🔥ERROR: CreatingEntry entry ${entry.sys.id}🔥`, error.name);
  }
}

const deletingEntry = async (entry) => {
  try {
    console.log(`DeletingEntry entry ${entry.sys.id}`);
    await entry.delete();
  } catch (error) {
    console.error(`🔥ERROR: DeletingEntry entry ${entry.sys.id}🔥`, error.name);
  }
}

const unpublishEntry = async (entry) => {
  try {
    console.log(`Unpublishing entry ${entry.sys.id}`);
    await entry.unpublish();
  } catch (error) {
    console.error(`🔥ERROR: Unpublishing entry ${entry.sys.id}🔥`, error);
  }
}

// (NOT WORKING) Función para ejecutar las peticiones al endpoint con un rate de 7 peticiones por segundo 
const ejecutarPeticiones = async (items, fetchFunction) => {
  const rate = 7; // Peticiones por segundo
  const delay = 1000 / rate; // Retraso entre peticiones en milisegundos

  for (let i = 0; i < items.length; i++) {
    await fetchFunction(items[i]);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

main();
