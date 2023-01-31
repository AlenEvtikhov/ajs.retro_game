import Character, {
	charStats
} from '../Character';
import {
	typeList
} from '../generators';

const statsList = Object.entries(Object.keys(charStats));

test('Checking using new at parent class for created indent', () => {
	expect(() => {
		const character = new Character(4, 'daemon');
	}).toThrow('Creating objects Character using new is illegal!');
});

test('Checking using new at child class for created indent', () => {
	expect(() => {
		const character = new typeList[0](4);
	}).not.toThrow('Creating objects Character using new is illegal!');
});

test.each(statsList)(('Test №%#: check element locations, key: %p, type: %p'),
	(key, type) => {
		const character = new typeList[key](1);
		expect(character.attack).toBe(charStats[type].attack);
	});