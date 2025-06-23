<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	// `data` is populated by the `load` function in +page.ts
	export let data: PageData;

	// `form` is populated by the result of our `addFact` action
	export let form: ActionData;

	// --- State for Filtering ---
	let selectedCategory = 'All'; // 'All' is the default filter

	// --- Reactive Statements ---
	// This code re-runs whenever `selectedCategory` or `data.facts` changes.
	$: filteredFacts =
		selectedCategory === 'All'
			? data.facts
			: data.facts.filter((fact) => fact.category === selectedCategory);
	
	// This will hold a reference to the form element so we can reset it
	let formElement: HTMLFormElement;

</script>

<svelte:head>
	<title>Fact Filtering Page</title>
</svelte:head>

<main class="container">
	<!-- Left Column: Form and Facts List -->
	<div class="left-column">
		<section class="form-section">
			<h1>Post a New Fact</h1>
			<!-- 
                - action="?/addFact" targets the `addFact` action in +page.ts
                - `use:enhance` provides a progressive enhancement, preventing a full-page reload on submit.
            -->
			<form 
                method="POST" 
                action="?/addFact" 
                use:enhance={() => {
                    // This function runs right before the form is submitted
                    return async ({ result }) => {
                        // This function runs after we get a response from the server action
                        if (result.type === 'success') {
                            formElement.reset(); // Clear the form on success
                        }
                    };
                }}
                bind:this={formElement}
            >
				<label for="factText">Your Fact</label>
				<textarea
					id="factText"
					name="factText"
					rows="4"
					placeholder="Did you know that..."
					required
                    value={form?.factText ?? ''}
				></textarea>

				<label for="category">Category</label>
				<select id="category" name="category" required value={form?.category ?? ''}>
					<option value="" disabled selected>-- Select a category --</option>
					{#each data.categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
                
                {#if form?.error}
                    <p class="error-message">{form.error}</p>
                {/if}

                {#if form?.success}
                    <p class="success-message">Fact added successfully!</p>
                {/if}

				<button type="submit">Add Fact</button>
			</form>
		</section>

		<section class="facts-list-section">
			<h2>Facts ({filteredFacts.length})</h2>
			<ul class="facts-list">
				{#each filteredFacts as fact (fact.id)}
					<li>
						<p>{fact.text}</p>
						<span class="category-tag">{fact.category}</span>
					</li>
				{:else}
					<p class="no-facts">No facts found for this category. Try adding one!</p>
				{/each}
			</ul>
		</section>
	</div>

	<!-- Right Column: Filter Buttons -->
	<aside class="right-column">
		<h3>Filter by Category</h3>
		<div class="filter-buttons">
			<!-- The 'All' button is a special case -->
			<button class:active={selectedCategory === 'All'} on:click={() => (selectedCategory = 'All')}>
				All
			</button>
			<!-- Loop through categories from our `load` function -->
			{#each data.categories as category}
				<button
					class:active={selectedCategory === category}
					on:click={() => (selectedCategory = category)}
				>
					{category}
				</button>
			{/each}
		</div>
	</aside>
</main>

<style>
	:root {
		--primary-color: #3498db;
		--secondary-color: #2c3e50;
		--background-color: #ecf0f1;
		--surface-color: #ffffff;
		--border-color: #bdc3c7;
		--success-color: #27ae60;
		--error-color: #c0392b;
	}

	.container {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 2rem;
		max-width: 1200px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.left-column, .right-column {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Form Styling */
	.form-section {
		background: var(--surface-color);
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.05);
	}
    
    h1, h2, h3 {
        color: var(--secondary-color);
        margin-top: 0;
    }

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		font-weight: bold;
		color: #34495e;
	}

	textarea, select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		transition: border-color 0.2s;
	}

	textarea:focus, select:focus {
		outline: none;
		border-color: var(--primary-color);
	}
    
    .error-message {
        color: var(--error-color);
        background: #fbeaea;
        border: 1px solid var(--error-color);
        padding: 0.75rem;
        border-radius: 4px;
        margin: 0;
    }

    .success-message {
        color: var(--success-color);
        background: #eaf7ee;
        border: 1px solid var(--success-color);
        padding: 0.75rem;
        border-radius: 4px;
        margin: 0;
    }

	/* Facts List */
	.facts-list-section {
		background: var(--surface-color);
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.05);
	}

	.facts-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.facts-list li {
		border-left: 4px solid var(--primary-color);
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 4px;
	}
    
    .facts-list li p {
        margin: 0 0 0.5rem 0;
    }

    .category-tag {
        display: inline-block;
        background: var(--primary-color);
        color: white;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .no-facts {
        color: #7f8c8d;
    }

	/* Filter Buttons */
	.right-column {
		background: var(--surface-color);
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        align-self: start; /* Sticks to the top */
	}

	.filter-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	button {
		padding: 0.75rem;
		border-radius: 4px;
		border: 1px solid var(--primary-color);
		background: white;
		color: var(--primary-color);
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.2s, color 0.2s;
	}

	button:hover {
		background: #eaf5fc;
	}
    
    button[type="submit"] {
        background-color: var(--primary-color);
        color: white;
        text-align: center;
    }

    button[type="submit"]:hover {
        background-color: #2980b9;
    }
    
	button.active {
		background: var(--primary-color);
		color: white;
	}

	/* Responsive Design */
	@media (max-width: 800px) {
		.container {
			grid-template-columns: 1fr;
		}
        .right-column {
            order: -1; /* Move filters to the top on mobile */
        }
	}
</style>