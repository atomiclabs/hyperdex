import styled from 'styled-components';

const arrowIcon = '<svg width="8" height="13" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#path0_fill" transform="rotate(-180 3.505 6)" fill="#7F8FA4"/><defs><path id="path0_fill" fill-rule="evenodd" d="M6.828 5.368c-.036-.035-.09-.044-.133-.07-.063-.085-.117-.174-.198-.253L1.857.519C1.309-.016.567-.161.2.196c-.366.357-.218 1.08.33 1.616l4.31 4.203-4.308 4.202c-.55.535-.697 1.259-.331 1.616.366.357 1.108.212 1.656-.323l4.64-4.526c.08-.08.135-.168.198-.253.043-.026.097-.035.133-.07.162-.158.208-.393.178-.646.03-.254-.016-.49-.178-.647z"/></defs></svg>';

const BackButton = styled('button')`
	width: 36px;
	height: 36px;
	border: 1px solid #313D4F;
	border-radius: 4px;
	background: #222C3C url('data:image/svg+xml;base64,${btoa(arrowIcon)}') no-repeat center;
	transition: background-color 0.3s ease-in-out;

	&:hover {
		background-color: #283447;
	}
`;

export default BackButton;
