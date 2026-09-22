class SimClock:
    def __init__(self, speed: float = 1.0):
        self.speed = speed          # multiplicateur (1 = temps réel)
        self.sim_seconds = 0.0      # temps simulé écoulé

    def advance(self, real_dt: float) -> float:
        self.sim_seconds += real_dt * self.speed
        return self.sim_seconds