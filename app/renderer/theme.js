const dark = {
	primaryGradient: 'linear-gradient(180deg, #687BF7 0%, #8050EF 100%);',
	buttonGradient: 'linear-gradient(180deg, #516173 0%, #3B4857 100%);',
	grayColor: '#7F8FA4',
	redColor: '#F80759',
};

const light = {
	...dark,
	buttonGradient: 'linear-gradient(180deg, #FFF 0%, pink 100%);', // TODO: Temp just to show of dark mode switch
};

const theme = {
	dark,
	light,
};

export default theme;
