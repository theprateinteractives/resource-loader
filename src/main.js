import fetch from 'unfetch';

function generateRequestsForIds(ids) {
	const forId = id => `i${id}: image(mediaId: ${id}) {...ImageBits}`;

	const allIds = ids.map(forId);

	return allIds.join('\n');
}

function parseResponse(json) {
	const map = {};

	Object.keys(json.data).forEach(idKey => {
		map[parseInt(idKey.slice(1))] = json.data[idKey];
	});

	return map;
}

function loadResources(resources) {

	return fetch('https://platform.theprate.com/graphql/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query AllResources {
					${generateRequestsForIds(Object.values(resources))}
				}
				fragment ImageBits on MultimediaImage {
					resourceName
					creditTitle
					creditUrl
					width
					height
				}
			`
		})
	})
	.then(res => res.json())
	.then(parseResponse)
}

export default function ResourceLoader(resources) {

	return {
		data: loadResources(resources),
		...resources,
	};
}