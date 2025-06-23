// src/routes/+page.ts

import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// Define the shape of our data
export interface Fact {
	id: number;
	category: string;
	text: string;
}

// Let's define our categories
// We need "News", "Science", and at least 7 total.
const CATEGORIES = [
	"Science",
	"News",
	"History",
	"Technology",
	"Nature",
	"Art",
	"Sports",
    "Programming"
];

// In a real app, this would be a database query.
// For this example, we'll use an in-memory array.
const mockFacts: Fact[] = [
	{ id: 1, category: 'Science', text: 'The human brain takes in 11 million bits of information every second but is aware of only 40.' },
	{ id: 2, category: 'History', text: 'The short-lived Anglo-Zanzibar War of 1896 is the shortest war on record, lasting just 38 minutes.' },
	{ id: 3, category: 'Nature', text: 'A group of flamingos is called a "flamboyance".' },
	{ id: 4, category: 'Technology', text: 'The first-ever VCR, which was introduced in 1956, was the size of a piano.' },
    { id: 5, category: 'Science', text: 'Octopuses have three hearts.' },
    { id: 6, category: 'Art', text: 'The Mona Lisa has no eyebrows. It was the fashion in Renaissance Florence to shave them off.' },
];

// The `load` function runs on the server to fetch data for the page.
export const load: PageServerLoad = () => {
	// We return the facts and categories so the Svelte page can access them.
	return {
		facts: mockFacts,
		categories: CATEGORIES
	};
};

// The `actions` object handles form submissions.
export const actions: Actions = {
	// This "addFact" name must match the form's action attribute: `action="?/addFact"`
	addFact: async ({ request }) => {
		const data = await request.formData();
		const factText = data.get('factText');
		const category = data.get('category');

		// Basic validation
		if (!factText || factText.toString().length < 10) {
			return fail(400, { error: 'Fact must be at least 10 characters long.', factText, category });
		}
		if (!category || !CATEGORIES.includes(category.toString())) {
			return fail(400, { error: 'Please select a valid category.', factText, category });
		}

		// Create the new fact
		const newFact: Fact = {
			id: Date.now(), // Simple unique ID for this example
			category: category.toString(),
			text: factText.toString()
		};

		// Add it to our "database"
        // The unshift() method adds new elements to the beginning of an array.
		mockFacts.unshift(newFact);

		// Return a success state. This will be available in `form` on the frontend.
		return { success: true };
	}
};