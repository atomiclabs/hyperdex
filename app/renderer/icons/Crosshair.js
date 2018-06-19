import React from 'react';
import Svg from 'components/Svg';

const Crosshair = props => (
	<Svg {...props} viewBox="0 0 13 13">
		<path d="M6.5 12.8A6.3 6.3 0 0 1 .2 6.5C.2 3 3 .2 6.5.2s6.3 2.8 6.3 6.3-2.8 6.3-6.3 6.3zm.6-2.8v1.7a5.3 5.3 0 0 0 4.6-4.6H10c-.3 0-.6-.3-.6-.6s.2-.6.6-.6h1.7a5.3 5.3 0 0 0-4.6-4.6V3c0 .3-.3.6-.6.6s-.6-.2-.6-.6V1.3a5.3 5.3 0 0 0-4.6 4.6H3c.3 0 .6.3.6.6s-.2.6-.6.6H1.3a5.3 5.3 0 0 0 4.6 4.6V10c0-.3.3-.6.6-.6s.6.2.6.6z"/>
	</Svg>
);

export default Crosshair;
