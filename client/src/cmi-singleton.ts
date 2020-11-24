// tmp singleton impl for cmi5
// replace with singleton in real @xapi/cmi5 once released (0.4.0)
import Cmi5 from "@xapi/cmi5";

let _cmi: Cmi5 | null = null;

export default function cmi5(): Cmi5 {
  if (!_cmi) {
    _cmi = new Cmi5();
  }
  return _cmi;
}
