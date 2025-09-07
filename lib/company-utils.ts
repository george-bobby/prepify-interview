// Company logos mapping utility

export function getCompanyLogo(companyName: string): string {
	const companyLogos: Record<string, string> = {
		'Amazon': '/covers/amazon.png',
		'Google': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg',
		'Meta (Facebook)': '/covers/facebook.png',
		'Microsoft':
			'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg',
		'Apple': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
		'Netflix': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg',
		'Tesla': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tesla.svg',
		'Uber': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/uber.svg',
		'Airbnb': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/airbnb.svg',
		'Adobe': '/covers/adobe.png',
	};

	return (
		companyLogos[companyName] ||
		'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/building.svg'
	);
}
