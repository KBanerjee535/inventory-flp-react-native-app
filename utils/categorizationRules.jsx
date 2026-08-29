/**
 * ============================================================================
 * CATEGORIZATION RULES CONFIGURATION
 * ============================================================================
 *
 * This file lets you define RULES for segregating spoken / dictated inspection
 * text (speech-to-text) into the correct CATEGORY (section) and SUBCATEGORY
 * (sub - subsection).
 *
 * These rules take PRIORITY over the automatic fuzzy title matching, so you can
 * control exactly which subcategory a piece of speech lands under.
 *
 * ----------------------------------------------------------------------------
 * HOW TO EDIT
 * ----------------------------------------------------------------------------
 * The structure is:
 *
 *   {
 *     "<MAIN CATEGORY name, lower-case>" : {
 *
 *       "<SUBCATEGORY name, exactly as it appears in the app>": {
 *         keywords: [
 *           "keyword",        // any word/phrase that triggers this subcategory
 *           "another phrase", // comma separated list
 *         ],
 *         weight: 1           // optional priority (higher = wins ties), default 1
 *       },
 *
 *       // OPTIONAL: if no keyword matches, send text to this subcategory
 *       // (the subcategory name above must match exactly)
 *       "_default": "External Door"
 *     }
 *   }
 * }
 *
 * ----------------------------------------------------------------------------
 * EXAMPLE  (Door -> External Door / Internal Door)
 * ----------------------------------------------------------------------------
 *   "door": {
 *     "External Door": {
 *       keywords: ["external", "front", "tarnishing", "tarnish", "chip", "chips",
 *                  "chip marks", "painted over", "mid level", "outside", "outer"]
 *     },
 *     "Internal Door": {
 *       keywords: ["internal", "low level", "inside", "inner"]
 *     },
 *     "_default": "External Door"
 *   }
 *
 * With the above:
 *   "Some light scattered chip marks painted over"      -> External Door
 *   "Some tarnishing seen to the front"                 -> External Door
 *   "Some low level scuffs seen"                        -> Internal Door
 * ============================================================================
 */

export const CATEGORIZATION_RULES = {
  // Example - EDIT/ADD your own categories below
  "door": {
    "External Door": {
      keywords: [
        "external",
        "front",
        "tarnishing",
        "tarnish",
        "tarnished",
        "chip",
        "chips",
        "chip marks",
        "painted over",
        "mid level",
        "outside",
        "outer",
      ],
      weight: 1,
    },
    "Internal Door": {
      keywords: [
        "internal",
        "low level",
        "inside",
        "inner",
      ],
      weight: 1,
    },
    "_default": "External Door",
  },

  // ===========================================================================
  // ▼▼▼ ADD YOUR OTHER CATEGORIES & SUBCATEGORIES BELOW ▼▼▼
  // ===========================================================================
  //
  // Example pattern (copy, uncomment, and edit):
  //
  // "window": {
  //   "Outside Window": {
  //     keywords: ["external", "outside", "outer", "front", "rear"],
  //   },
  //   "Inside Window": {
  //     keywords: ["internal", "inside", "inner"],
  //   },
  //   "_default": "Outside Window",
  // },
  //
  // "furniture": {
  //   "Wardrobe": {
  //     keywords: ["wardrobe", "cabinet", "cupboard", "door"],
  //   },
  //   "Bed": {
  //     keywords: ["bed", "mattress", "headboard", "frame"],
  //   },
  // },
  "fixtures & fittings": {
    "Spotlights": {
      keywords: ["light", "lamp", "bulb", "fixture"],
      weight: 1,
    },
    "Striplights": {
      keywords: ["sink", "tap", "faucet", "toilet", "shower"],
      weight: 1,
    },
    "Light Sensors": {
      keywords: ["sensor", "motion", "automatic"],
      weight: 1,
    },
    "Smoke Alarms": {
      keywords: ["smoke", "alarm", "detector", "smoke alarm"],
      weight: 1,
    },
    "Range of chrome switches and sockets": {
      keywords: ["switch", "socket", "plug", "outlet"],
      weight: 1,
    },
    "electric radiator": {
      keywords: ["radiator", "heater", "electric"],
      weight: 1,
    },
    "_default": "Spotlights",
  },
};