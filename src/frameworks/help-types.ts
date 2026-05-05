// Type for per-framework plain-English usage guides. Lives in its own
// module so each framework folder can import the type without depending on
// the aggregator.

export interface FrameworkHelp {
  // Plain-English expansion / fully unabbreviated name, when the meta name is
  // an acronym or insider term. Optional.
  expandedName?: string;
  // One-sentence "what this actually is" for someone who has never heard of it.
  whatItIs: string;
  // Concrete numbered steps for using the editor on this page.
  howToUse: string[];
  // Optional jargon glossary. Use sparingly — only terms a newcomer would
  // genuinely stumble on.
  glossary?: Record<string, string>;
}
