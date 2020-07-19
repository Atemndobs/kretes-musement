import { Handler, response, database as db } from 'kretes';
import ky from 'ky';
const { OK } = response;

interface Task {
	name: string;
	done: boolean;
}

const browse: Handler = async ({ params }) => {
	const tasks = await db.from('task');

	return OK(tasks);
};

export = browse;
