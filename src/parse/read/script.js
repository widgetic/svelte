import { parse } from 'acorn';
import spaces from '../../utils/spaces.js';

const scriptClosingTag = '<\/script>';

export default function readScript ( parser, start, attributes ) {
	const scriptStart = parser.index;
	const scriptEnd = parser.template.indexOf( scriptClosingTag, scriptStart );

	const source = spaces( scriptStart ) + parser.template.slice( scriptStart, scriptEnd );
	parser.index = scriptEnd + scriptClosingTag.length;

	let ast;

	try {
		ast = parse( source, {
			ecmaVersion: 8,
			sourceType: 'module'
		});
	} catch ( err ) {
		parser.acornError( err );
	}

	if ( !ast.body.length ) return null;

	ast.start = scriptStart;
	return {
		start,
		end: parser.index,
		attributes,
		content: ast
	};
}
