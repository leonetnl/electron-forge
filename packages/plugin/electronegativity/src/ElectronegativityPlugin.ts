import { ForgeConfig } from '@electron-forge/shared-types';
import PluginBase from '@electron-forge/plugin-base';
import runElectronegativity from '@doyensec/electronegativity';

// To be more precise, postPackage options we care about.
type PostPackageOptions = {
  outputPaths: string[];
};

export type Confidence = 'certain' | 'firm' | 'tentative';
export type CustomCheck = 'dangerousfunctionsjscheck' | 'remotemodulejscheck';
export type Severity = 'high' | 'medium' | 'low' | 'informational';

export type ElectronegativityConfig = {
  /**
   * Save the results to a file in CSV or SARIF format.
   */
  output?: string;
  /**
   * Whether to save the output in SARIF or CSV format.
   *
   * Defaults to CSV.
   */
  isSarif?: boolean;
  /**
   * Specified checks to run.
   */
  customScan?: CustomCheck[];
  /**
   * Only return findings with the specified level of severity or above.
   *
   * Defaults to `informational`.
   */
  severitySet?: Severity;
  /**
   * Only return findings with the specified level of confidence or above.
   *
   * Defaults to `tentative`.
   */
  confidenceSet?: Confidence;
  /**
   * Whether to show relative paths for files.
   *
   * Defaults to `false`.
   */
  isRelative?: false;
  /**
   * Specify a range to run Electron upgrade checks. For example, `'7..8'` checks an upgrade
   * from Electron 7 to Electron 8.
   */
  electronUpgrade?: string;
};

export default class ElectronegativityPlugin extends PluginBase<ElectronegativityConfig> {
  name = 'electronegativity';

  getHook(hookName: string) {
    if (hookName === 'postPackage') {
      return this.postPackage;
    }
    return null;
  }

  postPackage = async (_forgeConfig: ForgeConfig, options: PostPackageOptions) => {
    await runElectronegativity({
      ...this.config,
      input: options.outputPaths[0],
    }, true);
  }
}
