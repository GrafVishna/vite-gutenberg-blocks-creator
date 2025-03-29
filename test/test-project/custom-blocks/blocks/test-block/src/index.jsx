import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";

import edit from "./edit";
import save from "./save";

registerBlockType("test-namespace/test-block", {
	edit,
	save,
	attributes: {},
});
