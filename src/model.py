import torch.nn as nn
from torchvision.models import resnet50

class DeepFakeDetector(nn.Module):
    def __init__(self):
        super(DeepFakeDetector, self).__init__()

        self.base_model = resnet50(weights=None)
        num_features = self.base_model.fc.in_features
        self.base_model.fc = nn.Linear(num_features, 2)

    def forward(self, x):
        return self.base_model(x)
