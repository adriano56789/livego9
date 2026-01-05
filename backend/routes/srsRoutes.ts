import { Router } from 'express';
import { srsController } from '../controllers/srsController';

const router = Router();

// /api/v1/versions
router.get('/v1/versions', srsController.getVersions);

// /api/v1/summaries
router.get('/v1/summaries', srsController.getSummaries);

// /api/v1/features
router.get('/v1/features', srsController.getFeatures);

// /api/v1/clients
router.get('/v1/clients', srsController.getClients);
router.get('/v1/clients/:id', srsController.getClientById);

// /api/v1/streams
router.get('/v1/streams', srsController.getStreams);
router.get('/v1/streams/:id', srsController.getStreamById);
router.delete('/v1/streams/:id', srsController.deleteStreamById);

// /api/v1/connections
router.get('/v1/connections', srsController.getConnections);
router.get('/v1/connections/:id', srsController.getConnectionById);
router.delete('/v1/connections/:id', srsController.deleteConnectionById);

// /api/v1/configs
router.get('/v1/configs', srsController.getConfigs);
router.put('/v1/configs', srsController.updateConfigs);

// /api/v1/vhosts
router.get('/v1/vhosts', srsController.getVhosts);
router.get('/v1/vhosts/:id', srsController.getVhostById);

// /api/v1/requests
router.get('/v1/requests', srsController.getRequests);

// /api/v1/sessions
router.get('/v1/sessions', srsController.getSessions);

// /api/v1/metrics
router.get('/v1/metrics', srsController.getMetrics);

// WebRTC endpoints
router.post('/v1/rtc/publish', srsController.rtcPublish);
router.post('/v1/rtc/trickle/:sessionId', srsController.trickleIce);

export default router;
