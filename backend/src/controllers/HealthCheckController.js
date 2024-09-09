export default class HealthCheckController {
  async index(req, res) {
    return res.json({ status: 'ok' });
  }
}
