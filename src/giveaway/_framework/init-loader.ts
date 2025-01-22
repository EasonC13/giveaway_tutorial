import * as package_onchain_1 from "../_dependencies/onchain/0x1/init";
import * as package_onchain_2 from "../_dependencies/onchain/0x2/init";
import * as package_onchain_cf5ea60fe885e3f5162e30b6f3b3218c344be94ab9aece30f96ebee35be39b97 from "../giveaway/init";
import {StructClassLoader} from "./loader";

function registerClassesOnchain(loader: StructClassLoader) { package_onchain_1.registerClasses(loader);
package_onchain_2.registerClasses(loader);
package_onchain_cf5ea60fe885e3f5162e30b6f3b3218c344be94ab9aece30f96ebee35be39b97.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesOnchain(loader); }
