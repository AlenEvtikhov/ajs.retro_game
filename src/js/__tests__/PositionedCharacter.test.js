import PositionedCharacter from '../PositionedCharacter';
import {
	typeList
} from '../generators';

const character = new typeList[0](1);

const testCase = [
	[character, 'position', 8, 'position must be a number'],
	[character, 20, 'boardSize', 'boardSize must be a number'],
	['character', 20, 8], 'character must be instance of Character or its children',
];

test.each(testCase)(('Test №%#: check create PositionedCharacter, character: %p, position: %p. boardSize: %p'),
	([char, pos, boardSize, err]) => {
		expect(() => {
			const position = new PositionedCharacter(char, pos, boardSize);
		}).toThrow(err);
	});

test('Test create PositionedCharacter', () => {
	expect(() => {
		const position = new PositionedCharacter(character, 10, 8);
	}).not.toThrow('Creating objects Character using new is illegal!');
});

test('Test check getMessage method', () => {
	const position = new PositionedCharacter(character, 10, 8);
	const {
		level,
		attack,
		defense,
		health,
	} = character;
	expect(position.getMessage())
		.toBe(
			`\u{1F396} ${level}` +
			`\n\u{2694} ${attack}` +
			`\n\u{1F6E1} ${defense}` +
			`\n\u{2764} ${health}`,
		);
});